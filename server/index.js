const http = require("http");
const app = require("express")();
const websocketServer = require("websocket").server;
const cors = require('cors');
const newPlayerRequest = require("./requests/newPlayerRequest");
const leavingRequest = require("./requests/leavingRequest");
const playerListRequest = require("./requests/playerListRequest");
const createRequest = require("./requests/createRequest");
const joinRequest = require("./requests/joinRequest");
const calculatePositions = require("./methods/calculatePositions");
const moveRequest = require("./requests/moveRequest");

app.use(cors());
app.listen(3001, () => console.log("Listening Express on port 3001"));

const httpServer = http.createServer();
httpServer.listen(9000, () => console.log("Listening Websocket on port 9000"));
const wsServer = new websocketServer({
    "httpServer" : httpServer
});

wsServer.on("request", request => {
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("Opened connection"));
    connection.on("close", () => console.log("Closed connection"));
    connection.on("message", message => {
        const response = JSON.parse(message.utf8Data);
        console.log("Client sent:");
        console.log(response);
        if (response.type == "newPlayer") {
            newPlayerRequest(connection, response);
        }

        if (response.type == "leaving") {
            leavingRequest(connection, response);
        }

        if (response.type == "playerList") {
            playerListRequest(connection, response);
        }

        if (response.type == "create") {
            createRequest(connection, response);
        }

        if (response.type == "join") {
            joinRequest(connection, response);
        }

        if (response.type == "move") {
            moveRequest(connection, response);
        }
    });
});

/*
var buttons = calculatePositions.getStartingButtonPositions();
var timeSpent = 0;
var nextState;
buttons[0].pos[0] = 20.5;
buttons[0].pos[1] = 21;
buttons[0].speed[0] = -200;
buttons[0].speed[1] = -100;
buttons[1].pos[0] = 20.5;
buttons[1].pos[1] = 21;
buttons[1].speed[0] = -100;
buttons[1].speed[1] = -100;
while (calculatePositions.allIsStopped(buttons).length != 0) {
    nextState = calculatePositions.findAndFixClosestWallHit(buttons);
    buttons = nextState.newButtons;
    timeSpent += nextState.realms;
}
*/
