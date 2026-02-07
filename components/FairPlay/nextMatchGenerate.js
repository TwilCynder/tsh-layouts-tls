const script = document.scripts[document.scripts.length - 1];
script.parentElement.insertAdjacentHTML("beforeend", /*HTML*/`
    <div class="next_set container">
        <img class="bg" src="../../../Assets/FairPlay/Overlay/OVERLAY next game.png">
        <div class="next_set content"></div>
    </div>
`);

const link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.href = "../components/FairPlay/nextMatch.css";
document.getElementsByTagName("head")[0].appendChild(link);

RegisterAdditionalUpdate((data) => {
    console.log("OUI")
    updateNextMatchG($, data);
})  