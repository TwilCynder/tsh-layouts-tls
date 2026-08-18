function FitText(target) {
  console.log(target)
  document.fonts.ready.then(() => {
    if (target == null) return;
    if (target.css("font-size") == null) return;
    if (target.css("width") == null) return;

    let textElement = target.find(".text");

    if (textElement.text().trim().toLowerCase() == "undefined") {
      textElement.html("");
    }

    textElement.css("transform", "");
    let scaleX = 1;

    console.log(target.width(), textElement[0].scrollWidth)

    if (textElement[0].scrollWidth * scaleX > target.width()) {
      scaleX = target.width() / textElement[0].scrollWidth;
      textElement.css("transform", "scaleX(" + scaleX + ")");
    }
  });
}

const query = `         
    query Query($slug: String, $setNum: Int) {
        event(slug: $slug){
            sets(page: 1, perPage: $setNum, sortType:RECENT, filters:{
                state: 3
            }){
                nodes{
                    slots {
                        standing{
                            stats{
                                score{
                                    value
                                }
                            }
                        }
                        entrant {
                            id
                            name
                        }            
                    }
                }
            }
        }
    }    
` 

const defaultConfig = {
    sets: 5,
}

let setsContainer = $("#sets");
function add_set(player1, score1, player2, score2, id){
    let res = `
        <div class="result" id="r${id}">
            <div class="score p1">${score1}</div>
            <div class="names"><div class="text">
                <div class="name p1">${player1}</div>
                <div class="vs">vs</div>
                <div class="name p2">${player2}</div>
            </div></div>
            <div class="score p2">${score2}</div>
        </div>
    `

    setsContainer.append(res);
}

//add_set("SnooSnoo", 2, "Nacy's Bitch", 1, 4);
            
function load_sets(config, token){
    console.log("Load sets", token);
    return fetch('https://api.start.gg/gql/alpha', {         
        method: 'POST',         
        headers: {             
            'Content-Type': 'application/json',             
            'accept' : 'application/json',
            'Authorization' : `Bearer ` + token      
        },
        body: JSON.stringify({
            'query': query,
            'variables' : {
                "slug": config.event,
                "setNum": config.sets * 2
            } 
        }),  
        
    })
    .then((response) => response.json())     
    .then((responseBody) => {  
        $('#sets').empty();   

        if (!responseBody || !responseBody.data || responseBody.event){
            console.error("Invalid response :", responseBody);
            return;
        }

        const sets = responseBody.data.event.sets.nodes;

        const n = Math.min(sets.length, config.sets);
        for (let i = 0; i < n; i++){
            let set = sets[i];
            let p1 = set.slots[0].entrant.name;
            if (!set.slots[0].standing) continue;
            let p1score = set.slots[0].standing.stats.score.value;
            if (!set.slots[1].standing) continue; 
            let p2 = set.slots[1].entrant.name;
            let p2score = set.slots[1].standing.stats.score.value;
            add_set(p1, p1score, p2, p2score, i);
        }

        for (let i = 0; i < n; i++){
            FitText($(`.result#r${i} .names`));
        }
        console.log("Updated")
    })
    .catch(err => {console.error(err)});
}

/**
 * Removes the adress from the URL, keeping only the event slug
 * @param {string} url 
 * @returns 
 */
function stripURL(url){
    return url.split("start.gg/")[1];
}

gsap.config({ nullTargetWarn: false, trialWarn: false });

let startingAnimation = gsap
    .timeline({ paused: true })
    .from([".logo"], { duration: 0.5, autoAlpha: 0, ease: "power2.inOut" }, 0.5)
    .from(
        [".fade"],
        {
        duration: 0.8,
        autoAlpha: 0,
        ease: "power2.out",
        },
        0
    )

await Promise.all([
    fetch("./config.json"),
    fetch("./secret.json"),
    fetch('../../user_data/settings.json'),
])
    .then( results => Promise.all(results.map(async (response) => {
        if (!response.ok){
            console.warn("Could not load file", response.url)
            return {};
        }
        return await response.json();
    }
    )))
    
    .then(async ([config, secret, tsh_settings]) => {
        if (!secret.token){
            console.error("No token found");
            return;
        }

        config = Object.assign(defaultConfig, config, window.settings ?? {});

        const load_sets_ = () => load_sets(config, secret.token)

        if (tsh_settings && tsh_settings.TOURNAMENT_URL){
            config.event = config.event ?? tsh_settings.TOURNAMENT_URL;
        }

        if (!config.event) return;
        if (config.event.includes("start.gg")) config.event = stripURL(config.event);

        await load_sets_();
        startingAnimation.restart();
        setInterval(() => {
            load_sets_();
        }, 20000);
    });

    //$("#R1").html(res);
