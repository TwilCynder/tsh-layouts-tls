/*
TODO
- INVERTED OSEF
- Animation (dont setcount)
- Placeholder de chargement/pas de data
- Check les erreurs côté serveur quand un joueur est introuvable
- Exclure les sets side event côté serveur (matrix build)
*/

import { askTOS, buildURL } from "../includeTLS/TOSUtil.js";

const default_config = {
    TOS_addr: 5001
}

function getPlayerParam(player, i){
  if (player.id && player.id[0]) return `=${player.id[0]}`;
  else if (player.name) return `Name=${player.name}`;
  
  return false;
}

function getPlayersParams(data){
  const teams = data?.score?.[window.scoreboardNumber]?.team;
  if (!teams || !teams["1"] || !teams["2"]) return false;

  const player1 = teams["1"].player["1"];
  const player2 = teams["2"].player["1"];
  if (!player1 || !player2) return false;

  const param1 = getPlayerParam(player1);
  const param2 = getPlayerParam(player2);

  if (!param1 || !param2) return false;

  return "p1" + param1 + "&p2" + param2;
}

function scoreString(slot){
  return slot.score ?? (slot.placement == 1 ? "W" : "L");
}

async function contentHTML(params, addr){
  let result = await askTOS(addr, params);
  if (!result) return ["Couldn't fetch data"];

  let {h2h, ids: {id1, id2}} = result; 
  if (!h2h) return ["No match found"];

  console.log("Loaded H2H :", h2h, id1, id2);

  let p1Total = 0, p2Total = 0;
  
  for (const set of h2h){
    if (set.slots[0].ids[0] == id2){
      set.inverted = true;
    }

    if (set.winner == (set.inverted ? 1 : 0)){
      p1Total++;
    } else {
      p2Total++;
    }
  }
  $(".setcount").html();

  h2h = h2h.slice(0, 5);

  let html = "";
  let loadedSets = []
  for (let i = 0; i < h2h.length; i++){
    const set = h2h[i];
    const inverted = set.inverted;

    const [slot1, slot2] = inverted ? [set.slots[1], set.slots[0]] : [set.slots[0], set.slots[1]];
    const winner = inverted ? 1 - set.winner : set.winner;
    const [p1Result, p2Result] = winner == 0 ? ["winner", "loser"] : ["loser", "winner"];

    html += `
      <div class="s${i} set">
        <div class="score-container ${p1Result}">
          <div class="score">${scoreString(slot1)}</div>
        </div>
        <div class="event-info">
        </div>
        <div class="score-container ${p2Result}">
          <div class="score">${scoreString(slot2)}</div>
        </div>
      </div>
    `

    loadedSets.push(set);
    
  }

  return [html, p1Total + " - " + p2Total, loadedSets];
}

LoadEverything().then(() => {

  tsh_settings = _.defaultsDeep(tsh_settings, default_config);
  const TOSAddr = buildURL(tsh_settings.TOS_addr, "h2h");

  gsap.config({ nullTargetWarn: false, trialWarn: false });

  Start = async () => {

  };


  let firstUpdate = false;

  Update = async (event) => { 
    let data = event.data;
    let oldData = event.oldData;

    const playerParams = getPlayersParams(data);
    const oldPlayerParams = getPlayersParams(oldData);

    console.log(playerParams, oldPlayerParams)

    if (playerParams == oldPlayerParams && firstUpdate) return; //if no difference and we have nothing displayed yet : skipping
    firstUpdate = true;

    //From this point, we are updating the page (even if it's to display nothing)

    let result = await contentHTML(playerParams, TOSAddr);

    //let isTeams = Object.keys(data.score[window.scoreboardNumber].team["1"].player).length > 1;

    let [content = "", setCount = "", loadedSets = []] = result;
    $(".sets-container").html(content ?? "");
    SetInnerHtml($(".setcount"), setCount ?? "");
    if (setCount){
      const startingAnimation = gsap.timeline({paused: false});
      loadedSets.forEach((set, i) => {
        console.log(`.s${i} .event-info`)

        SetInnerHtml($(`.s${i} .event-info`), `
          <div class="event-name">${set.event.tournament.name}</div>
          <div class="additional-info">${set.event.name} - ${set.fullRoundText}</div>
        `)

        startingAnimation.from(
          $(".s"+i),
          {x: -100, autoAlpha: 0, duration: 0.3},
          0.2 + 0.2 * i
        );
      });
      
      startingAnimation.restart();
    }

  };
});