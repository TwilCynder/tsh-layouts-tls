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
  
      if (!isTeams) {
        const teams = Object.values(data.score[window.scoreboardNumber].team);

      }
  
      SetInnerHtml($(`.p1.score`), String(data.score[window.scoreboardNumber].team["1"].score));
      SetInnerHtml($(`.p2.score`), String(data.score[window.scoreboardNumber].team["2"].score));

      console.log(data.score[window.scoreboardNumber].team["1"].player["1"])
      SetInnerHtml($(`.p1.nameee`), String(data.score[window.scoreboardNumber].team["1"].player["1"].name));
      SetInnerHtml($(`.p2.nameee`), String(data.score[window.scoreboardNumber].team["2"].player["1"].name));

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
  