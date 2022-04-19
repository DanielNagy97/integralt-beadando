const { players, matches } = require("../data/hashmaps");
const errorSender = require("../methods/errorSender");
const matchIdCreate = require("../methods/matchIdCreate");
const normalSender = require("../methods/normalSender");
const calculatePositions = require("../methods/calculatePositions");

module.exports = function createMatch(connection, response) {
    if (!players.has(response.payload.id)) {
        errorSender(connection,
            "2",
            { "id": response.payload.id });
        console.warn("No player with id " + response.payload.id + ". Match not created.");
        return;
    }

    const matchesIterator = matches.keys();
    var currentMatch = matchesIterator.next();

    while (!currentMatch.done) {
        if (matches.get(currentMatch.value).players.includes(response.payload.id)) {
            console.warn("Player " + response.payload.id + " tried creating match but already in match " + currentMatch.value + ".");
            errorSender(players.get(response.payload.id).connection,
                "3",
                { "matchId": currentMatch.value });
            return;
        }
        currentMatch = matchesIterator.next();
    }

    const matchId = matchIdCreate();

    if (["player-vs-ai", "ai-vs-ai", "player-vs-player"].includes(response.payload.gameType)) {
        matches.set(matchId, {
            "players": [],
            "buttons": calculatePositions.getStartingButtonPositions(),
            "points": {"red" : 0, "blue" : 0},
            "matchType": response.payload.gameType,
            "nextMove": 0
        });
        console.log("Player " + response.payload.id + " created " + response.payload.gameType + " match " + matchId);
        normalSender(players.get(response.payload.id).connection,
            "create",
            {
                "gameId": matchId
            });
    }
    else {
        console.warn("Player " + response.payload.id + " sent wrong game type.");
        errorSender(players.get(response.payload.id).connection,
            "5",
            { "gameType": response.payload.gameType });
    }

}