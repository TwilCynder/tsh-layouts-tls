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
      
      for (const [t, team] of Object.entries(data.score[window.scoreboardNumber].team)){
        console.log(t, team)
        const playerClass = "p" + t;
        const player = team.player["1"];

        SetInnerHtml($(cosd(playerClass, "score")), String(team.score));
        SetInnerHtml($(cosd(playerClass, "name")), String(player.name));
        SetInnerHtml($(cosd(playerClass, "seed")), player.seed ? "Seed " + player.seed : "");
      }
    
    };
  });
  