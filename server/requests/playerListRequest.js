const { players } = require("../data/hashmaps");
const playerListMaker = require("../methods/playerListMaker");

module.exports = function playerList(response) {
    const payLoad = {
        "type": "playerList",
        "payload": {
            "list": playerListMaker()
        }
    };

    if (players.has(response.payload.id)) {
        players.get(response.payload.id).connection.send(JSON.stringify(payLoad));
        console.log("Sent player list to player " + response.payload.id + " named " + players.get(response.payload.id).name + ".");
    }
    else {
        console.warn("No player with id " + response.payload.id + ". Nothing sent.");
    }

}