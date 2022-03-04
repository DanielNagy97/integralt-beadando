const { players } = require("../data/hashmaps");
const idCreate = require("../methods/idCreate.js");
const normalSender = require("../methods/normalSender");
const playerListMaker = require("../methods/playerListMaker");

module.exports = function newPlayer(connection, response) {
    const playerId = idCreate();

    players.set(playerId, {
        "connection": connection,
        "name": response.payload.name
    });
    console.log("Added new player " + playerId + " named " + response.payload.name);
    normalSender(players.get(playerId).connection,
        "newPlayer",
        { "id": playerId });

    const playersIterator = players.values();
    var currentPlayer = playersIterator.next();

    while (!currentPlayer.done) {
        normalSender(currentPlayer.value.connection,
            "playerList",
            { "list": playerListMaker() });
        currentPlayer = playersIterator.next();
    }
}