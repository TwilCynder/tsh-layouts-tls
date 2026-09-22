export function buildURL(url, endpoint){
    if (typeof url === "number") url = "localhost:" + url;
    if (!url.startsWith("http")) url = "http://" + url;

    return url + "/data/" + endpoint;
}

export async function askTOS(url, ...queryParams){
    queryParams.join("&");
    const res = await fetch(url + "?" + queryParams.join("&"));
    if (!res.ok){
        console.warn("Error : Server returned code", res.status, await res.text());
        return;
    }
    return await res.json();
}