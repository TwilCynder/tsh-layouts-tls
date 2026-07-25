update_delay = 2000;

LoadEverything(() => {
    if (!window.config) {
        window.config = {
            size: "normal",
        };
    }
    
    Start = async (event) => {};
    
    Update = async (event) => {
        let data = event.data;
        let oldData = event.oldData;
        
        if (
            Object.keys(oldData).length == 0 ||
            Object.keys(oldData.commentary).length !=
            Object.keys(data.commentary).length
        ) {
            let html = "";
            
            const commentators = Object.values(data.commentary);
            if (commentators.length == 2){
                html = `
                    <div class="commentators_outer_container">
                        <img class="absol bg" src="Assets/common/Overlay">
                    </div>
                `
            }

            Object.values(data.commentary).forEach((commentator, index) => {
                html += `
              <div class="commentator_container commentator${index}">
                  <div class="name"></div>
                  <div class="pronoun"></div>
                  ${
                window.config.size == "normal"
                ? `<div class="real_name"></div>`
                : ""
            }
                  ${
            window.config.size == "normal" ||
            window.config.size == "mini"
            ? `<div class="twitter"></div>`
            : ""
        }
              </div>
          `;
    });
    $(".container").html(html);
}

for (const [index, commentator] of casters.entries()) {
    if (commentator.name) {
        $(`.commentator${index}`).css("display", "");
        SetInnerHtml(
            $(`.commentator${index} .name`),
            `
            ${/*<span class="mic_icon"></span>*/""}
            <span class="team">
              ${commentator.team ? commentator.team + "&nbsp;" : ""}
            </span>
            ${await Transcript(commentator.name)}
          `
        );
        SetInnerHtml($(`.commentator${index} .pronoun`), commentator.pronoun);
        SetInnerHtml(
            $(`.commentator${index} .real_name`),
            commentator.real_name
        );
        SetInnerHtml(
            $(`.commentator${index} .twitter`),
            commentator.twitter ? "@" + commentator.twitter : ""
        );
    } else {
        $(`.commentator${index}`).css("display", "none");
    }
}
};
});
