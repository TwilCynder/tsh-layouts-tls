export class CompositeMessageError extends Error {
    constructor(...messageParts){
        super(messageParts.join(" "));
        this.messageParts = messageParts;
    }

    setCause(cause){
        this.cause = cause;
        return this;
    }
}

function buildURL(url){
    if (typeof url === "number") url = "localhost:" + url;
    if (!url.startsWith("http")) url = "http://" + url;
    return url + "/token";
}

export async function SGGOGToken(url){
    url = buildURL(url);
    try {
        const res = await fetch(url)
        if (!res.ok){
            const data = await res.json().catch(_ => ({err: null}))
            console.error("Request to SGGOG at URL", url, "failed with code", res.status, data.err ? ": " + data.err : "");
            return;
        }
        const data = await res.json();
        if (!data.token){
            console.error("No token found in SGGOG response");
            return;
        }
        console.log("Token obtained from SGGOG");
        return data.token;
    } catch (err){
        console.error("Request to SGGOG at URL", url, "failed with error :", err);
        return;
    }
}

function whatHappened(res){
    return res.status == 404 ? "File Not Found" : "server returned code " + res.status;
}

function loadJSON_(path){
    return fetch(path).then(res => {
        if (!res.ok){
            throw whatHappened(res);
        }
        return res.json();
    })

}

export function loadJSON(path){
    return loadJSON_(path).catch(err => {
        throw new Error("Could not load JSON file " + path, {cause: err})
    })
}

export function loadJSONOptional(path){
    return loadJSON_(path).catch(err => {
        console.warn("Could not load optional JSON file", path, ":", err);
        return {}
    })
}

export async function loadSettings(default_ = {}){
    const fileSettings = await loadJSONOptional("./settings.json")
    return Object.assign(default_, fileSettings, window.settings);
}

export function loadSecrets(){
    return loadJSONOptional("./secrets.json")
}

export function loadTSHUserSettings(){
    return loadJSON("../../user_data/settings.json")
}