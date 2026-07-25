import { initAlternatingLogos } from "../includeTLS/initAlternatingLogos.js";

update_delay = 2000;

LoadEverything(() => {
  if (!window.config) {
    window.config = {
      size: "normal",
    };
  }

  initAlternatingLogos($);
  var logos = $(".logos");

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

    let casters = Object.values(data.commentary);
    console.log("======\n", casters, casters.length)
    if (casters.length % 2 == 1){
      logos.hide();
    } else {
      logos.show();
    }

    let castersCount = 0;
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
        castersCount++;
      } else {
        $(`.commentator${index}`).css("display", "none");
      }
    }

    console.log("======\n", casters)
    if (castersCount % 2 == 1){
      logos.hide();
    } else {
      logos.show();
    }
  };
});
