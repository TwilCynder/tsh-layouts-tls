LoadEverything().then(() => {
  if (!window.config) {
    window.config = {
      size: "normal",
    };
  }

  gsap.config({ nullTargetWarn: false, trialWarn: false });

  let startingAnimation = gsap
    .timeline({ paused: true })
    .from(
      [".fade"],
      {
        duration: 0.8,
        autoAlpha: 0,
        ease: "power2.out",
      },
      0
    )
  Start = async () => {
    startingAnimation.restart();
  };

  Update = async (event) => {
    let data = event.data;
    let oldData = event.oldData;

     {
      let html = "";
      Object.values(data.commentary).forEach((commentator, index) => {
        console.log(commentator.pronoun)
        html += `
              <div class="commentator c${index} fade_right">
                <div class="commentator_inner">
                    <div class="name"></div>
                    ${commentator.pronoun ? '<div class = "pronoun"></div>' : ""}
                    ${commentator.twitter ? '<div class = "twitter"></div>' : ""}
                </div>
              </div>
          `;
      });
      $(".container").html(html);
    }

    for (const [index, commentator] of Object.values(
      data.commentary
    ).entries()) {
      if (commentator.name) {
        $(`.commentator.c${index}`).css("display", "");
        SetInnerHtml(
          $(`.c${index} .name`),
          `
            ${await Transcript(commentator.name)}
          `
        );

        SetInnerHtml($(`.c${index} .pronoun`),commentator.pronoun);

        SetInnerHtml($(`.c${index} .twitter`),commentator.twitter ? "@" + commentator.twitter : "");
      } else {
        $(`.commentator.c${index}`).css("display", "none");
      }
    }
  };
});
