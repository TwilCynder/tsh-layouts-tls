# Settings
- player : use a player index here to display only that player's information. Any truthy value skips match info, so e.g. `true` will display both but skip match info
- perPlayerElements (array of objects) : registers information-displaying functions
  - selector : will be used as long with `p<index>` to select the div
  - content : function called with the player and team objects in an object ({player, team}), returns the content to set the selected div to