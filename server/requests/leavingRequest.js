const { players } = require("../data/hashmaps");
const errorSender = require("../methods/errorSender");

module.exports = function removePlayer(connection, response) {
    const removedPlayerName = players.get(response.payload.id).name;
    if (players.has(response.payload.id)) {
        players.delete(response.payload.id);
        console.log("Removed player " + response.payload.id + " named " + removedPlayerName);
    }
    else {
        errorSender(connection, "2", {"id" : response.payload.id})
        console.warn("No player with id " + response.payload.id + ".");
    }
}