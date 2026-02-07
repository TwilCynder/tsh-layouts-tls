LoadEverything().then(() => {
  if (!window.config) {
    window.config = {
      size: "normal",
    };
  }

  Start = async (event) => {};

  Update = async (event) => {
    let data = event.data;
    let oldData = event.oldData;

    for (const [index, commentator] of Object.values(
      data.commentary
    ).entries()) {
      SetInnerHtml($(`.c${index+1}.name`), await Transcript(commentator.name))
      
      let infoParts = [];
      if (commentator.pronoun) infoParts.push(commentator.pronoun);
      if (commentator.twitter) infoParts.push("@" + commentator.twitter); 
      SetInnerHtml($(`.c${index+1}.pronoun-twitter`), infoParts.join(" - "))
    }
    
    RunAdditionalUpdates(data);
  };
});
