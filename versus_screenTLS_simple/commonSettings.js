function spanify(text, f){
    return text ? "<span>" + (f ? f(text) : text) + "</span>" : null
}

function separatedSpans(separator, ...texts){
    return texts.map(([text, f]) => spanify(text, f)).filter(v=>!!v).join(separator);
}

window.settings = {
    perPlayerElements: [
        {selector: "seed-info", content: ({player}) => separatedSpans(" - ", [player.seed, t=>"Seed " + t], [player.twitter, t => "@"+t])}
    ]
}