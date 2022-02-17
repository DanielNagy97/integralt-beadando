const { players } = require("../data/hashmaps");
const idCreate = require("../methods/idCreate.js");
const playerListMaker = require("../methods/playerListMaker");

module.exports = function newPlayer(connection, response) {
    const playerId = idCreate();

    players.set(playerId, {
        "connection": connection,
        "name": response.payload.name
    });

    const payLoad = {
        "type": "newPlayer",
        "payload": {
            "id": playerId
        }
    };
    connection.send(JSON.stringify(payLoad));

    players.values().forEach(element => {
        element.connection.send(JSON.stringify({
            "type": "playerList",
            "payload": {
                "list": playerListMaker()
            }
        }))
    });
}