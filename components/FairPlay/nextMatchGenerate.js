const script = document.scripts[document.scripts.length - 1];
script.parentElement.insertAdjacentHTML("beforeend", /*HTML*/`
    <img class="bg" src="../../../Assets/FairPlay/Overlay/OVERLAY next game.png">
    <div id="next_set"></div>
`);

const link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.href = "../components/FairPlay/nextMatch.css";
document.getElementsByTagName("head")[0].appendChild(link);