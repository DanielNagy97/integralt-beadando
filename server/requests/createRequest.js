const { players, matches } = require("../data/hashmaps");
const errorSender = require("../methods/errorSender");
const matchIdCreate = require("../methods/matchIdCreate");
const normalSender = require("../methods/normalSender");

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

    var newMatchButtons = [
        { color: "red", id: "0", pos: [70, 250] },
        { color: "red", id: "1", pos: [250, 160] },
        { color: "red", id: "2", pos: [250, 340] },
        { color: "red", id: "3", pos: [430, 70] },
        { color: "red", id: "4", pos: [430, 250] },
        { color: "red", id: "5", pos: [430, 430] },
        { color: "blue", id: "0", pos: [930, 250] },
        { color: "blue", id: "1", pos: [750, 160] },
        { color: "blue", id: "2", pos: [750, 340] },
        { color: "blue", id: "3", pos: [570, 70] },
        { color: "blue", id: "4", pos: [570, 250] },
        { color: "blue", id: "5", pos: [570, 430] },
        { color: "white", id: "-1", pos: [500, 250] }
    ];

    const matchId = matchIdCreate();

    if (["player-vs-ai", "ai-vs-ai", "player-vs-player"].includes(response.payload.gameType)) {
        matches.set(matchId, {
            "players": [],
            "buttons": newMatchButtons,
            "points": [0, 0],
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