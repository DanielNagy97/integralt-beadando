const { players, matches } = require("../data/hashmaps");
const errorSender = require("../methods/errorSender");

module.exports = function removePlayer(connection, response) {
    const removedPlayerName = players.get(response.payload.id).name;
    if (players.has(response.payload.id)) {
        
        const matchesIterator = matches.keys();
        var currentMatch = matchesIterator.next();

        while (!currentMatch.done) {
            if (matches.get(currentMatch.value).players.includes(response.payload.id)) {
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
        // players.delete(response.payload.id);
        // console.log("Removed player " + response.payload.id + " named " + removedPlayerName);
    }
    else {
        errorSender(connection, "2", { "id": response.payload.id })
        console.warn("No player with id " + response.payload.id + ".");
    }
}