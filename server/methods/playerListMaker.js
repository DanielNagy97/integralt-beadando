const { players } = require("../data/hashmaps");

module.exports = function playerList() {
    var playerList = []
    players.values().forEach(element => {
        playerList.push(element.name);
    });
    return playerList;
}