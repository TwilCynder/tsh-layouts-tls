# Comment créer un nouvel overlay TLS
Les divs sont mises à jour par le script selon leur classe.  
Classes pour les infos relatives au match
- bestof : "best of" suivi de la valeur reseignée dans TSH 
- phase : pools/top 8/etc. Peut être configuré pour inclure le best-of (voir plus bas)
- match

Classes pour infos relatives aux joueurs - toutes ces divs doivent se trouver dans une div englobante de classe "p1" OU avoir elles-mêmes la classe "p1" pour les infos J1 ; pareil pour le J2

- name : nom du joueur / de la team, contient le sponsor, les pronoms et le L pour la grande finale
- pronoun : inclut dans name ou pas selon la config - voir plus bas
- score 
- twitter
- seed
- flagcountry
- flagstate

Il n'est pas nécessaire d'avoir toutes ces divs, en général on utilise que match, best of, name et score sur les overlays TLS

Divs spéciales (identifiée par ID et pas par classe) :
- next_set : contient la description du prochain match
- caster_names_container : contiendra les noms de chaque caster, à la suite. Chaque nom de caster est placé dans un span de classe "caster_name" 

J'ai fait la suite en anglais sans faire exprès

The overlay can be configured through the `window.settings` object (add a script at the end of the web page, before the index.js inclusion, to change that per-page, like `<script>window.settings = "..."</script>`)
- settings.display.inline_losers : if true, add a "[L]" to player names when relevant ; if false, add a span of class "losers", containing "L" instead.
- settings.display.insline_sponsor : if true, prefix the team name of each player to their name, with a separating "|" ; if false, add a span of class "sponsor" instead
- settings.display.standalone_pronoun : if false, player pronouns are added after their name, in a span of class "pronoun". Set to true if you already have a dedicated div for player pronoun and don't need the script to automatically add one next to the name.
- settings.SLT : pour la SLT
- settings.forceTeamDisplay : if false, in a 2v2 match the name displayed for each team will rotate between the team name and the player names (separated by a "/"). If true, only the team name will appear. For teams with no team name, this does nothing and the player names are always displayed.  
- settings.phase_bestof : include the best of text in the phase div