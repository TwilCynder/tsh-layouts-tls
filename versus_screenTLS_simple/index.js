import { cosd } from "../includeTLS/util.js";

LoadEverything().then(() => {
    let startingAnimation = gsap
      .timeline({ paused: true })
      

  
    Start = async (event) => {
      startingAnimation.restart();
    };
  
    Update = async (event) => {
      let data = event.data;
      let oldData = event.oldData;
  
      let isTeams = Object.keys(data.score[window.scoreboardNumber].team["1"].player).length > 1;

      if (!isTeams){
        for  (const [index, team] of Object.entries(data.score[window.scoreboardNumber].team)){ //we can't have more than two teams in TSH, right ???
          const player = team.player["1"] ?? {};
          SetInnerHtml($(cosd("p"+index, "score")), String(data.score[window.scoreboardNumber].team[index].score));
          SetInnerHtml($(cosd("p"+index, "name")), `<span class="sponsor">${player.team || ""}</span>${await Transcript(player.name)}<span class="pronoun">${player.pronoun || ""}</span>`);
          SetInnerHtml($(cosd("p"+index, "seed")), String(player.seed));
        }
      }

/*
${
  player.team ? (tsh_settings.display.inline_sponsor ? player.team + " | " : 
  `
  <span class="sponsor">
    ${player.team}
  </span> 
  `) : ""
}
${await Transcript(player.name)}

${ (tsh_settings.display.standalone_pronoun) ? "" :
  `
  <span class="pronoun scoreboard_pronoun">
  ${player.pronoun ? player.pronoun : ""}
  </span>
  `
} 
${team.losers ? (tsh_settings.display.inline_losers ? " [L]" : "<span class='losers'>L</span>") : ""}
*/

      SetInnerHtml($(".tournament"), data.tournamentInfo.tournamentName);
      SetInnerHtml($(".event"), data.tournamentInfo.eventName);
      SetInnerHtml($(".match"), data.score[window.scoreboardNumber].match);
  
      SetInnerHtml(
        $(".phase:not(.container)"),
        data.score[window.scoreboardNumber].phase ? data.score[window.scoreboardNumber].phase : ""
      );
    
      SetInnerHtml(
        $(".container .best_of"),
        data.score[window.scoreboardNumber].best_of_text ? data.score[window.scoreboardNumber].best_of_text : ""
      );
  
    
    };
  });
  