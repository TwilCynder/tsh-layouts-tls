function RegisterAdditionalUpdate(f){
    if (!window.additionalUpdates){
        window.additionalUpdates = [f]
    } else {
        window.additionalUpdates.push(f);
    }
}

function RunAdditionalUpdates(data, settings){
    console.log(window.additionalUpdates)
    if (window.additionalUpdates){
        for (const f of window.additionalUpdates){
            f(data, settings);
        }
    }
}

function cosd(c1, c2){
  return `.${c1} .${c2}, .${c1}.${c2}`;
}