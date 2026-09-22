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

function getPlayers(teams){
  if (!teams["1"] || !teams["2"]) return false;
  const player1 = teams["1"].player["1"];
  const player2 = teams["2"].player["1"];
  if (!player1 || !player2) return false;

  return [player1, player2];
}

function scoreString(slot){
  return slot.score ?? (slot.placement == 1 ? "W" : "L");
}

async function contentHTML(players, resolver, addr){
  if (!players){
    console.warn("No players");
    return "";
  }

  let params = [];
  for (let i = 0; i < 2; i++){
    let player = players[i];
    if (player.id && player.id[0]) params.push(`p${i + 1}=${player.id[0]}`);
    else if (player.name) params.push(`p${i + 1}Name=${player.name}`);
    else {
      console.warn("Player", i + 1, "has no id or name", player);
    }
  }

  let result = await askTOS(addr, ...params);
  if (!result) return "";

  let {h2h, ids: {id1, id2}} = result; 
  if (!h2h) return "";

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
  $(".setcount").html(p1Total + " - " + p2Total);

  h2h = h2h.slice(0, 5);

  let html = "";
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

    resolver.add(".s"+i+" .event-info", `
      <div class="event-name">${set.event.tournament.name}</div>
      <div class="additional-info">${set.event.name} - ${set.fullRoundText}</div>
    `);
    
  }

  return html;
}

LoadEverything().then(() => {

  tsh_settings = _.defaultsDeep(tsh_settings, default_config);
  const TOSAddr = buildURL(tsh_settings.TOS_addr, "h2h");

  gsap.config({ nullTargetWarn: false, trialWarn: false });

  let startingAnimation = gsap
    .timeline({ paused: true })
;

  Start = async () => {

  };

  Update = async (event) => {
    let data = event.data;
    let oldData = event.oldData;

    let isTeams = Object.keys(data.score[window.scoreboardNumber].team["1"].player).length > 1;

    if (!isTeams) {
      const teams = data.score[window.scoreboardNumber].team;
      const players = getPlayers(teams);

      const resolver = new ContentResolver();
      $(".sets-container").html(await contentHTML(players, resolver, TOSAddr));
      resolver.resolve();
    }

  };
});