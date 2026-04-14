function cosd(c1, c2){
  return `.${c1} .${c2}, .${c1}.${c2}`;
}

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
      
      const player1 = data.score[window.scoreboardNumber].team["1"].player["1"];
      const player2 = data.score[window.scoreboardNumber].team["2"].player["1"];

      SetInnerHtml($(cosd("p1", "score")), String(data.score[window.scoreboardNumber].team["1"].score));
      SetInnerHtml($(cosd("p2", "score")), String(data.score[window.scoreboardNumber].team["2"].score));

      SetInnerHtml($(cosd("p1", "nameee")), String((player1.team ? player1.team + " | " : "") + player1.name));
      SetInnerHtml($(cosd("p2", "nameee")), String((player2.team ? player2.team + " | " : "") + player2.name));

      SetInnerHtml($(cosd("p1", "seed")), String(player1.seed));
      SetInnerHtml($(cosd("p1", "seed")), String(player2.seed));

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
  