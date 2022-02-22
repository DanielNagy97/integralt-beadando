const { players } = require("../data/hashmaps");

module.exports = function playerList() {
    var playerList = []

    const playersIterator = players.values();
    var currentPlayer = playersIterator.next();

    while (!currentPlayer.done) {
        playerList.push(currentPlayer.value.name);
        currentPlayer = playersIterator.next();
    }
    return playerList;
}