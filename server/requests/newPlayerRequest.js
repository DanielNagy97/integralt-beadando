const { players } = require("../data/hashmaps");
const errorSender = require("../methods/errorSender");
const idCreate = require("../methods/idCreate.js");
const normalSender = require("../methods/normalSender");
const playerListMaker = require("../methods/playerListMaker");

module.exports = function newPlayer(connection, response) {

    var playersIterator = players.values();
    var currentPlayer = playersIterator.next();

    while (!currentPlayer.done) {
        if (currentPlayer.value.name == response.payload.name) {
            errorSender(connection, "1", { "name": response.payload.name });
            return;
        }
        currentPlayer = playersIterator.next();
    }

    const playerId = idCreate();

    players.set(playerId, {
        "connection": connection,
        "name": response.payload.name
    });
    console.log("Added new player " + playerId + " named " + response.payload.name);
    normalSender(players.get(playerId).connection,
        "newPlayer",
        { "id": playerId });

    playersIterator = players.values();
    currentPlayer = playersIterator.next();

    while (!currentPlayer.done) {
        normalSender(currentPlayer.value.connection,
            "playerList",
            { "list": playerListMaker() });
        currentPlayer = playersIterator.next();
    }
}