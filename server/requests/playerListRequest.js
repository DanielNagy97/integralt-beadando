const { players } = require("../data/hashmaps");
const playerListMaker = require("../methods/playerListMaker");

module.exports = function playerList(response) {
    const payLoad = {
        "type": "playerList",
        "payload": {
            "list": playerListMaker()
        }
    };
    players[response.payLoad.id].send(JSON.stringify(payLoad));
}