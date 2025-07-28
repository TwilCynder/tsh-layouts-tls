const default_config = {
  display : {
    "inline_pronoun" : true,
    "sponsor":  true
  }
}

LoadEverything().then(() => {
  if (!window.PLAYER) {
    window.PLAYER = 1;
  }

  let config = _.defaultsDeep(window.config, default_config);

  gsap.config({ nullTargetWarn: false, trialWarn: false });

  let startingAnimation;// = gsap.timeline({ paused: true });

  Start = async (event) => {
    //startingAnimation.restart();
  };

  Update = async (event) => {
    let data = event.data;
    let oldData = event.oldData;

    if (
      !oldData.score ||
      JSON.stringify(data.score[window.scoreboardNumber].team[window.PLAYER]) !=
        JSON.stringify(oldData.score[window.scoreboardNumber].team[window.PLAYER])
    ) {
      let team_html = "";
      Object.values(data.score[window.scoreboardNumber].team[window.PLAYER].player)
        .forEach( async(_, p) => {
          team_html += `
          <div class="player${p + 1} player_container">

          </div>`;
        });
      $(".content").html(team_html);

      startingAnimation = gsap.timeline({paused: false})
      for (const [p, player] of Object.entries(data.score[window.scoreboardNumber].team[window.PLAYER].player)) {
        SetInnerHtml(
          $(
            `.player${p}`
          ),
          `${config.display.sponsor ? `
            <span class="sponsor">
              ${player.team ? player.team : ""}
              ${config.teamNameSeparator ? config.teamNameSeparator : ""}
            </span> ` 
            : ""
          }
          ${await Transcript(player.name)}
          ${config.display.inline_pronoun ? `
            <span class="pronoun">
            ${player.pronoun ? player.pronoun : ""}
            </span>`
            : ""
          }`
        );

        startingAnimation.from(
          $(`.player${p + 1}`),
          { x: -100, autoAlpha: 0, duration: 0.3 },
          0.2 + 0.2 * p
        );
      }

      console.log("restart animation")
      startingAnimation.restart();
    }
  };
});
