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
              $(`.p${t + 1} .name`),
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
              $(`.p${t + 1} .pronoun`),
              info.join(" - ")
            );

            SetInnerHtml($(`.p${t + 1} .twitter`), player.twitter ? "@" + player.twitter : "");

            SetInnerHtml($(`.p${t + 1} .score`), String(team.score));

          }
        }
      }
    } 

    SetInnerHtml($(".tournament_name"), data.tournamentInfo.tournamentName);

    SetInnerHtml($(".match"), data.score[window.scoreboardNumber].match);
    SetInnerHtml($(".bestof"), data.score[window.scoreboardNumber].best_of_text);

    if (window.outofgame){
      console.log(tsh_settings);
      console.log(data.streamQueue)

      const stream_queue = data.streamQueue[tsh_settings.stream];
      console.log(stream_queue)

      const match = stream_queue[1]; //[1] is supposed to be the current match
      if (match && match.team && Object.keys(match.team).length > 0){
        SetInnerHtml($(".next-match-container"), `
          <div> PROCHAIN MATCH </div>
          <div>
            <span class = "next-match-player next-match-p1">${match.team[1].player[1].name ?? "TBD" }</span> VS <span class = "next-match-player next-match-p2">${match.team[2].player[1].name ?? "TBD" }</span>
          </div>
        `)
      } else {
        SetInnerHtml($(".next-match-container"), "")
      }
    }

  };
});
