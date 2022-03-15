const { players, matches } = require("../data/hashmaps");
const errorSender = require("../methods/errorSender");
const normalSender = require("../methods/normalSender");
const calculatePositions = require("../methods/calculatePositions");

module.exports = function joinMatch(connection, response) {
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
            console.warn("Player " + response.payload.id + " tried joining match but already in match " + currentMatch.value + ".");
            errorSender(players.get(response.payload.id).connection,
                "3",
                { "matchId": currentMatch.value });
            return;
        }
        currentMatch = matchesIterator.next();
    }

    if (!matches.has(response.payload.gameId)) {
        console.warn("No match with id " + response.payload.id + ".");
        errorSender(connection,
            "4",
            { "gameId": response.payload.gameId });
        return;
    }

    matches.get(response.payload.gameId).players.push(response.payload.id);
    console.log("Player " + response.payload.id + " joined match " + response.payload.gameId + ".");
    normalSender(players.get(response.payload.id).connection,
        "join",
        {
            "gameType": matches.get(response.payload.gameId).matchType,
            "gameState": {
                "buttons": calculatePositions.removeSpeed(matches.get(response.payload.gameId).buttons)
            }
        })
}