import { initAlternatingLogos } from "../includeTLS/initAlternatingLogos.js";
import { Carousel } from "../includeTLS/SIHCarousel.js";
import { translateRound } from "../includeTLS/util.js";
import { startTimeDisplay } from "../includeTLS/timeDisplayManager.js";
import { loadSLT, updateSLTTeam } from "./js/SLT.js";

update_delay = 2000;
let logo_interval = 10000;

if (window.SLT){
  loadSLT();
}

const default_config = {
  display : {
    "inline_losers" : false,
    "inline_sponsor":  true,
    "standalone_pronoun": false
  }
}

let carousels = [null, null];


function cosd(c1, c2){
  return `.${c1} .${c2}, .${c1}.${c2}`;
}

LoadEverything().then(() => {

  tsh_settings = _.defaultsDeep(tsh_settings, default_config);

  initAlternatingLogos($, logo_interval);

  gsap.config({ nullTargetWarn: false, trialWarn: false });

  let startingAnimation = gsap
    .timeline({ paused: true })
    .from([".logo"], { duration: 0.5, autoAlpha: 0, ease: "power2.inOut" }, 0.5)
    .from(
      [".fade"],
      {
        duration: 0.8,
        autoAlpha: 0,
        ease: "power2.out",
      },
      0
    )
;

  Start = async () => {
    startingAnimation.restart();
    $(`.league_team`).hide();
  };

  Update = async (event) => {

    console.log("UPDATE");
    let data = event.data;
    let oldData = event.oldData;

    let casters = Object.values(data.commentary);
    console.log("Casters :", casters)
    let html = ""
    casters.forEach((commentator) => {
      if (commentator.name){
        html += `
        <span class = "caster_name">${commentator.name}</span>
        `;
      }
    });
    $("#caster_names_container").html(html);

    let isTeams = Object.keys(data.score[window.scoreboardNumber].team["1"].player).length > 1;

    if (!isTeams) {
      for (const [t, team] of [
        data.score[window.scoreboardNumber].team["1"],
        data.score[window.scoreboardNumber].team["2"],
      ].entries()) {

        {
          const player = team.player["1"];
          const playerClass = "p" + (t + 1);
          if (player) {
            SetInnerHtml(
              $(cosd(playerClass, "name")),
              `
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
              `
            );

            if (window.SLT){
              updateSLTTeam(t, player.name);
            }
            

            SetInnerHtml(
              $(cosd(playerClass, "flagcountry")),
              player.country.asset
                ? `<div class='flag' style='background-image: url(../../${player.country.asset.toLowerCase()})'></div>`
                : ""
            );
            SetInnerHtml(
              $(cosd(playerClass, "flagstate")),
              player.state.asset
                ? `<div class='flag' style='background-image: url(../../${player.state.asset})'></div>`
                : ""
            );
            SetInnerHtml(
              $(cosd(playerClass, "sponsor_icon")),
              player.sponsor_logo
                ? `<div style='background-image: url(../../${player.sponsor_logo})'></div>`
                : ""
            );
            SetInnerHtml(
              $(cosd(playerClass, "avatar")),
              player.avatar
                ? `<div style="background-image: url('../../${player.avatar}')"></div>`
                : ""
            );
            SetInnerHtml(
              $(cosd(playerClass, "twitter")),
              player.twitter
                ? `<span class="twitter_logo"></span>${String(player.twitter)}`
                : ""
            );
            SetInnerHtml(
              $(cosd(playerClass, "pronoun.chip")),
              player.pronoun ? player.pronoun : ""
            );
            SetInnerHtml(
              $(cosd(playerClass, "seed")),
              player.seed ? `Seed ${player.seed}` : ""
            );
            SetInnerHtml(
              $(cosd(playerClass, "sponsor-container")),
              `<div class='sponsor-logo' style='background-image: url(../../${player.sponsor_logo})'></div>`
            );

            SetInnerHtml($(cosd(playerClass, "score")), String(team.score));
          }
        }
      }
    } else {
      $(`.league_team`).hide();
      SetInnerHtml($(`.sponsor_icon`), "");
      SetInnerHtml($(`.avatar`), "");
      SetInnerHtml($(`.online_avatar`), "");
      SetInnerHtml($(`.twitter`), "");
      SetInnerHtml($(`.sponsor-container`), "");

      for (const [t, team] of [
        data.score[window.scoreboardNumber].team["1"],
        data.score[window.scoreboardNumber].team["2"],
      ].entries()) {
        let losersStr = team.losers ? (tsh_settings.display.inline_losers ? " [L]" : "<span class='losers'>L</span>") : ""

        let teamNamePlayers = ""
        let names = [];
        for (const [p, player] of Object.values(team.player).entries()) {
          if (player && player.name) {
            names.push(player.name);
          }
        }
        teamNamePlayers = names.join(" / ");

        const playerClass = "p" + (t + 1);

        if (team.teamName && !tsh_settings.forceTeamDisplay){
          if (!carousels[t]) carousels[t] = new Carousel;
          let carousel = carousels[t];
          carousel.reset();

          carousel.add(`
            ${team.teamName}
            ${losersStr}
          `);
          carousel.add(`
            ${teamNamePlayers}
            ${losersStr}
          `);
          carousel.selector = `.p${t + 1}.container .name`

          carousel.startRotation(10000);
        } else if (team.teamName && tsh_settings.forceTeamDisplay == "teamName") {
          SetInnerHtml($(cosd(playerClass, "name")), team.teamName);
        } else {
          SetInnerHtml($(cosd(playerClass, "name")), teamNamePlayers);
        }

        SetInnerHtml($(cosd(playerClass, "score")), String(team.score));

        if ($(".sf6.online").length > 0) {
          if (!player.twitter && !player.pronoun) {
            gsap.to($(`.p${t + 1}.chips`), { autoAlpha: 0 });
          } else {
            gsap.to($(`.p${t + 1}.chips`), { autoAlpha: 1 });
          }
        }


        SetInnerHtml($(cosd(playerClass, "flagcountry")), "");

        SetInnerHtml($(cosd(playerClass, "flagstate")), "");


      }
    }

    SetInnerHtml($(".tournament_name"), data.tournamentInfo.tournamentName);

    let match = data.score[window.scoreboardNumber].match;

    try {
      match = translateRound(data.score[window.scoreboardNumber].phase, data.score[window.scoreboardNumber].match);
    } catch (e){
      console.error(e);
    }

    SetInnerHtml($(".match"), match);

    try {
      let nextMatch = data.streamQueue && data.streamQueue.toulouselaststock["2"];
      console.log(nextMatch)
      if (nextMatch && (nextMatch.team["1"] || nextMatch.team["2"])){
        let t1 = nextMatch.team["1"];
        let t2 = nextMatch.team["2"];
        let text = 
          `Prochain match : <span class = "next_set_name">${t1 ? t1.player["1"].name : "TBD"}</span> VS <span class = "next_set_name">${t2 ? t2.player["1"].name : "TBD"}</span>`;

        $("#next_set").show()
        SetInnerHtml($("#next_set"), text);
      } else {
        $("#next_set").hide()
      }
    } catch (e) {
      //pas de stream queue
      $("#next_set").hide()
    }

    if (tsh_settings.phase_bestof){
    let phaseTexts = [];
      if (data.score[window.scoreboardNumber].phase) phaseTexts.push(data.score[window.scoreboardNumber].phase);
      if (data.score[window.scoreboardNumber].best_of_text) phaseTexts.push(data.score[window.scoreboardNumber].best_of_text);

      SetInnerHtml($(".phase"), phaseTexts.join(" - "));
    } else {
      SetInnerHtml($(".phase"), data.score[window.scoreboardNumber].phase);
    }

    SetInnerHtml($(".bestof"), "Best of " + data.score[window.scoreboardNumber].best_of);
  };
});

startTimeDisplay("time");