const { players, matches } = require("../data/hashmaps");
const errorSender = require("../methods/errorSender");
const matchIdCreate = require("../methods/matchIdCreate");
const normalSender = require("../methods/normalSender");

module.exports = function createMatch(connection, response) {
    if (!players.has(response.payload.id)) {
        errorSender(connection,
            "Not a player",
            { "id": response.payload.id });
        console.warn("No player with id " + response.payload.id + ". Match not created.");
        return;
    }

    const matchesIterator = matches.keys();
    var currentMatch = matchesIterator.next();

    while (!currentMatch.done) {
        if (matches[currentMatch.value].players.includes(response.payload.id)) {
            console.warn("Player " + response.payload.id + " tried creating match but already in match " + currentMatch.value + ".");
            errorSender(players.get(response.payload.id).connection,
                "Player already in match",
                { "matchId": currentMatch.value });
            return;
        }
    }

    var newMatchButtons = [{ "color": "red", "id": 0, "pos": [0, 0] },
    { "color": "red", "id": 1, "pos": [0, 100] },
    { "color": "red", "id": 2, "pos": [0, 200] },
    { "color": "red", "id": 3, "pos": [0, 300] },
    { "color": "blue", "id": 0, "pos": [600, 0] },
    { "color": "blue", "id": 1, "pos": [600, 100] },
    { "color": "blue", "id": 2, "pos": [600, 200] },
    { "color": "blue", "id": 3, "pos": [600, 300] },
        { "color": "ball", "id": 0, "pos": [300, 150] }];
    
    const matchId = matchIdCreate();

    if (response.payload.gameType == "player-vs-ai") {
        matches.set(matchId, {
            "players": [response.payload.id],
            "buttons": newMatchButtons,
            "points": [0, 0],
            "matchType": response.payload.gameType,
            "nextMove": 0,
            "spectators" : []
        });
        console.log("Player " + response.payload.id + " created " + response.payload.gameType + " match " + matchId);
        normalSender(players.get(response.payload.id).connection,
            "join",
            {
            "buttons": matches.get(matchId).buttons,
            "nextMove": matches.get(matchId).nextMove
        });
    }
    else if (response.payload.gameType == "ai-vs-ai") {
        matches.set(matchId, {
            "players": [],
            "buttons": newMatchButtons,
            "points": [0, 0],
            "matchType": response.payload.gameType,
            "nextMove": 0,
            "spectators" : [response.payload.id]
        });
        console.log("Player " + response.payload.id + " created " + response.payload.gameType + " match " + matchId);
        normalSender(players.get(response.payload.id).connection,
            "join",
            {
                "buttons": matches.get(matchId).buttons,
                "nextMove": matches.get(matchId).nextMove
            });
    }
    else if (response.payload.gameType == "player-vs-player") {
        matches.set(matchId, {
            "players": [response.payload.id],
            "buttons": newMatchButtons,
            "points": [0, 0],
            "matchType": response.payload.gameType,
            "nextMove": -1,
            "spectators" : []
        });
        console.log("Player " + response.payload.id + " created " + response.payload.gameType + " match " + matchId);
        normalSender(players.get(response.payload.id).connection,
            "join",
            {
                "buttons": matches.get(matchId).buttons,
                "nextMove": matches.get(matchId).nextMove
            });
    }
    else {
        console.warn("Player " + response.payload.id + " sent wrong game type.");
        errorSender(players.get(response.payload.id).connection,
            "Wrong gamme type.",
            { "gameType": response.payload.gameType });
    }

}