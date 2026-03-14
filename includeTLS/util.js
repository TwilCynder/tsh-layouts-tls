let roundTranslation = {
    "32" : {
      "Tour 1": "Top 24 Winner",
      "Quart": "Top 12 Winner"
    },
    " 8" : {
      "Tour 1" : "Top 8 Loser"
    },
    "24": {
      "Tour 1 Winner" : "Top 24 Winner"
    }
  }
  
export function translateRound(phase, round){
  console.log(phase, round);
  round = round.replace("Match de qualification", "Qualifier")  
  for (let p in roundTranslation){
      if (phase.includes(p)){
        for (let r in roundTranslation[p]){
          console.log("Match : ", r);
          if (round.includes(r)) {
            return roundTranslation[p][r]
          }
        }
      }
    }
    return round;
  }