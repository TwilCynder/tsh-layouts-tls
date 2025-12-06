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
  Start = async () => {
    startingAnimation.restart();
  };

  Update = async (event) => {
    let data = event.data;
    let oldData = event.oldData;
    console.log(data)
    let isTeams = Object.keys(data.score[window.scoreboardNumber].team["1"].player).length > 1;



    if (!isTeams) {
      for (const [t, team] of [
        data.score[window.scoreboardNumber].team["1"],
        data.score[window.scoreboardNumber].team["2"],
      ].entries()) {
        for (const [p, player] of [team.player["1"]].entries()) {
          if (player) {
            SetInnerHtml(
              $(`.p${t + 1}.name`),
              `
                <span class="sponsor">
                  ${player.team ? player.team : ""}
                </span>
                ${await Transcript(player.name)}
                ${team.losers ? " [L]" : ""}
              `
            );

            let info = [];
            if (player.pronoun) info.push(player.pronoun);
            if (player.seed) info.push("Seed " + player.seed);

            SetInnerHtml(
              $(`.p${t + 1}.info`),
              info.join(" - ")
            );

            SetInnerHtml($(`.p${t + 1}.score`), String(team.score));

          }
        }
      }
    } 

    SetInnerHtml($(".tournament_name"), data.tournamentInfo.tournamentName);

    SetInnerHtml($(".match"), data.score[window.scoreboardNumber].match);
    SetInnerHtml($(".bestof"), data.score[window.scoreboardNumber].best_of_text);


  };
});
