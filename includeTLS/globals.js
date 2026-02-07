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