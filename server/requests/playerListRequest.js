const { players } = require("../data/hashmaps");
const errorSender = require("../methods/errorSender");
const normalSender = require("../methods/normalSender");
const playerListMaker = require("../methods/playerListMaker");

module.exports = function playerList(connection, response) {
    if (players.has(response.payload.id)) {
        normalSender(players.get(response.payload.id).connection, "playerList", { "list": playerListMaker() });
        console.log("Sent player list to player " + response.payload.id + " named " + players.get(response.payload.id).name + ".");
    }
    else {
        errorSender(connection, "Not a player", {"id" : response.payload.id})
        console.warn("No player with id " + response.payload.id + ". Nothing sent.");
    }

}