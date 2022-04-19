const { players, matches } = require("../data/hashmaps");
const errorSender = require("../methods/errorSender");
const normalSender = require("../methods/normalSender");

module.exports = function removePlayer(connection, response) {
    if (players.has(response.payload.id)) {
        
        const matchesIterator = matches.keys();
        var currentMatch = matchesIterator.next();
        var endedMatch;
        var endedMatchId;

        while (!currentMatch.done) {
            if (matches.get(currentMatch.value).players.includes(response.payload.id)) {
                endedMatchId = currentMatch.value;
                endedMatch = matches.get(endedMatchId);
                matches.get(currentMatch.value).players = matches.get(currentMatch.value).players.filter(item => item != response.payload.id);
                switch (matches.get(currentMatch.value).matchType) {
                    case "ai-vs-ai":
                        if (matches.get(currentMatch.value).players.length == 0) {
                            matches.delete(currentMatch.value);
                        }
                        break;
                    case "player-vs-ai":
                        matches.delete(currentMatch.value);
                        break;
                    case "player-vs-player":
                        for (const playerId in matches.get(currentMatch.value).players) {
                            errorSender(players.get(playerId).connection,
                                "6",
                                { "gameId": currentMatch.value }
                            );
                        }
                        break;
                    }
                }
                currentMatch = matchesIterator.next();
            }
        normalSender(connection, "endGame", { "gameId": endedMatchId, "finalScore": endedMatch.points });

    }
    else {
        errorSender(connection, "2", { "id": response.payload.id })
        console.warn("No player with id " + response.payload.id + ".");
    }
}