let teamsPromise, teamNamesPromise;
let SLTTeams = {}, SLTTeamNames = {};

export function loadSLT(){
    teamsPromise = fetch('./data/SLT1/SLT_Players.json')
    .then( res => res.json())
    .then( json => {
      SLTTeams = Object.values(json);
  });

  teamNamesPromise = fetch('./data/SLT1/TeamNames.json')
    .then (res => res.json())
    .then (json => {
      SLTTeamNames = json;
    })
}

function findPlayer(players, name){
    console.log(players);
  for (let player of players){
    if (player.name.includes(name)) return player
  }
}

export async function updateSLTTeam(teamN, playerName){
  try {
    await Promise.all([teamsPromise, teamNamesPromise]);
    let player = findPlayer(SLTTeams, playerName);
    let team = player.team;
    team = SLTTeamNames[team] || team;
    console.log("SLT TEAM", playerName, team);
    if (team){
      SetInnerHtml(
        $(`.p${teamN + 1} .team_name`),
        team
      );
      $(`.p${teamN + 1}.league_team`).show();
    } else {
      $(`.p${teamN + 1}.league_team`).hide();
    }
  } catch (err){
    console.error("Error while updating SLT team", teamN, ":", err);
    $(`.p${teamN + 1}.league_team`).hide();
  }

}