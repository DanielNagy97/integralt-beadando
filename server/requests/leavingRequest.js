const { players } = require("../data/hashmaps");

module.exports = function removePlayer(response) {
    const removedPlayerName = players.get(response.payload.id);
    players.delete(response.payload.id);
    console.log("Removed player " + response.payload.id + " named " + removedPlayerName);
}