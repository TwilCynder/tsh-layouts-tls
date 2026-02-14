export function updateNextMatch($, data){
    try {
        let nextMatch = data.streamQueue && data.streamQueue.toulouselaststock["2"];
        console.log(nextMatch)
        if (nextMatch && (nextMatch.team["1"] || nextMatch.team["2"])){
        let t1 = nextMatch.team["1"];
        let t2 = nextMatch.team["2"];
        let text = 
            `Prochain match : <span class = "next_set_name">${t1 ? t1.player["1"].name : "TBD"}</span> <span class="next-match-vs">VS</span> <span class = "next_set_name">${t2 ? t2.player["1"].name : "TBD"}</span>`;

        $(".next_set.container").show()
            SetInnerHtml($(".next_set.content"), text);
        } else {
            $(".next_set.container").hide()
        }
    } catch (e) {
      //pas de stream queue
      $(".next_set.container").hide()
    }
}
