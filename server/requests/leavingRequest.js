const { players } = require("../data/hashmaps");

module.exports = function removePlayer(response) {
    players.delete(response.payload.id);
}