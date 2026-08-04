import { cosd, translateRound } from "../includeTLS/util.js";

LoadEverything().then(() => {
  gsap.config({ nullTargetWarn: false, trialWarn: false });
  
  let startingAnimation = gsap
  .timeline({ paused: true })
  .from(
    [".fade"],
    {
      duration: 0.8,
      autoAlpha: 0,
      ease: "power2.out",
    },
    0
  )
  .from(
    [".fade_up"],
    {
      duration: 0.8,
      autoAlpha: 0,
      y: "20px",
      ease: "power2.out",
    },
    0
  )
  .from(
    [".fade_dl"],
    {
      duration: 0.8,
      autoAlpha: 0,
      y: "-20px",
      x: "20px",
      ease: "power2.out",
    },
    0
  )
  .from(
    [".fade_dr"],
    {
      duration: 0.8,
      autoAlpha: 0,
      y: "-20px",
      x: "-20px",
      ease: "power2.out",
    },
    0
  )
  
  
  
  Start = async (event) => {
    startingAnimation.restart();
  };
  
  Update = async (event) => {
    let data = event.data;
    let oldData = event.oldData;
    
    let isTeams = Object.keys(data.score[window.scoreboardNumber].team["1"].player).length > 1;
    
    console.log("SEETINGS", tsh_settings.test)

    if (!isTeams){
      for  (const [index, team] of Object.entries(data.score[window.scoreboardNumber].team)){ //we can't have more than two teams in TSH, right ???
        const player = team.player["1"] ?? {};
        const playerClass = "p"+index;
        SetInnerHtml($(cosd(playerClass, "score")), String(team.score));
        SetInnerHtml($(cosd(playerClass, "name")), `<span class="sponsor">${player.team || ""}</span>${await Transcript(player.name)}<span class="pronoun">${player.pronoun || ""}</span>`);
        SetInnerHtml($(cosd(playerClass, "seed")), "Seed " + player.seed);

        if (tsh_settings.perPlayerElements){
          const fArgs = {player, team};
          for (const element of tsh_settings.perPlayerElements){
            SetInnerHtml($(cosd(playerClass, element.selector)), element.content(fArgs))
          }
        }
        
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
    SetInnerHtml($(".match"), translateRound(data.score[window.scoreboardNumber].phase, data.score[window.scoreboardNumber].match));
    
    SetInnerHtml(
      $(".phase:not(.container)"),
      data.score[window.scoreboardNumber].phase ? data.score[window.scoreboardNumber].phase : ""
    );
    
    SetInnerHtml(
      $(".best_of"),
      data.score[window.scoreboardNumber].best_of_text ? data.score[window.scoreboardNumber].best_of_text : ""
    );
    
    
  };
});
