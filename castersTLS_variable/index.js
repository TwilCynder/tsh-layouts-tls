update_delay = 2000;

LoadEverything(() => {
    if (!window.config) {
        window.config = {
            size: "normal",
        };
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
    
    Start = async (event) => {
        startingAnimation.restart();
    };
    
    Update = async (event) => {
        let data = event.data;
        let oldData = event.oldData;
        
        const commentators = Object.values(data.commentary).filter(commentator => !!commentator.name);
        const oldCommsLength = oldData.commentary ? Object.values(oldData.commentary).filter(commentator => !!commentator.name).length : 0;
        
        if (
            commentators.length !=
            oldCommsLength
        ) { 
            const commentators = Object.values(data.commentary).filter(commentator => !!commentator.name);
            
            let castersDivs = "", globalClasss = null;
            
            if (commentators.length == 2 && false){
                castersDivs = `
                    <div class="commentator c1">
                        <div class="name"></div>
                        <div class="twitter"></div>
                    </div>
                    <div class="commentator c2">
                        <div class="name"></div>
                        <div class="twitter"></div>
                    </div>
                `
                globalClasss = "duo bg";
            } else {
                for (let i = 0; i < commentators.length; i++){
                    castersDivs += `
                        <div class="commentator c${i + 1}">
                            <img class="caster_bg" src="../../../Assets/common/Overlay/CASTER_SOLO_2.png"/>

                            <div class="name"></div>
                            <div class="twitter"></div>
                        </div>
                    `
                }
                globalClasss = "solo";
            }
            
            const html = `
                <div class="commentators_outer_container ${globalClasss}">
                    ${castersDivs}
                </div>
            `
            $(".content").html(html);
        }
        
        for (const [index, commentator] of Object.entries(data.commentary)) {
            if (commentator.name) {
                $(`.c${index}`).css("display", "");
                SetInnerHtml(
                    $(`.c${index} .name`),
                    `
                        <span class="team">
                            ${commentator.team || ""}
                        </span>
                        ${await Transcript(commentator.name)}
                        <span class="pronoun scoreboard_pronoun">
                            ${commentator.pronoun || ""}
                        </span>
                `);
                    SetInnerHtml(
                        $(`.c${index} .twitter`),
                        commentator.twitter ? "@" + commentator.twitter : ""
                    );
                } else {
                    $(`.c${index}`).css("display", "none");
                }
            }
        };
    });
    