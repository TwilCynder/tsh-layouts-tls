LoadEverything().then(() => {
  if (!window.PLAYER) {
    window.PLAYER = 1;
  }

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
            ${config.display.sponsor ? `
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
          }
          </div>`;
        });
      $(".player1_content").html(tournament_html);

      startingAnimation = gsap.timeline({paused: false})
      for (const [s, tournament] of Object.values(
        data.score[window.scoreboardNumber].history_sets[window.PLAYER]
      )
        .slice(0, 6)
        .entries()) {
        SetInnerHtml(
          $(
            `.player1_content .tournament${
              s + 1
            } .info .tournament_info .tournament_name`
          ),
          tournament.tournament_name
        );
        SetInnerHtml(
          $(
            `.player1_content .tournament${
              s + 1
            } .info .tournament_info .event_name`
          ),
          tournament.event_name
        );
        SetInnerHtml(
          $(`.player1_content .tournament${s + 1} .info .tournament_logo`),
          `
              <span class="logo" style="background-image: url('${tournament.tournament_picture}')"></span>
            `
        );
        SetInnerHtml(
          $(`.player1_content .tournament${s + 1} .info .placement`),
          tournament.placement +
            `<span class="ordinal">${getNumberOrdinal(
              tournament.placement
            )}</span><span class="num_entrants">/${tournament.entrants}</span>`
        );
        startingAnimation.from(
          $(`.tournament${s + 1}`),
          { x: -100, autoAlpha: 0, duration: 0.3 },
          0.2 + 0.2 * s
        );
      }
      console.log("restart animation")
      startingAnimation.restart();
    }
  };
});
