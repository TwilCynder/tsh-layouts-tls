function hide($){
    $(".next_set.container").hide();
}

export function updateNextMatch($, data, settings){
    try {

        console.log("Update next match")
        const stream = (data.score[window.scoreboardNumber].auto_update == "stream") ? (data.score[window.scoreboardNumber].station ?? settings.stream) : settings.stream;
        if (!stream) {hide($); return}

        const streamQueue = data.streamQueue ? data.streamQueue[stream] : null;
        if (!streamQueue) {hide($); return}

        const nextMatch = streamQueue["2"];
        if (!nextMatch) {hide($); return};

        console.log(nextMatch)

        if ((nextMatch.team["1"] || nextMatch.team["2"])){
            let t1 = nextMatch.team["1"];
            let t2 = nextMatch.team["2"];
            let text = 
                `Prochain match : <span class = "next_set_name">${t1 ? t1.player["1"].name : "TBD"}</span> <span class="next-match-vs">VS</span> <span class = "next_set_name">${t2 ? t2.player["1"].name : "TBD"}</span>`;

            $(".next_set.container").show()
            SetInnerHtml($(".next_set.content"), text);
        } else {
            hide($);
        }
    } catch (e) {
        //pas de stream queue
        console.log("Erreur stream queue", e)
        hide($);
    }
}
