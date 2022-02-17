const http = require("http");
const app = require("express")();
const websocketServer = require("websocket").server;
const cors = require('cors');
const newPlayerRequest = require("./requests/newPlayerRequest");
const leavingRequest = require("./requests/leavingRequest");
const playerListRequest = require("./requests/playerListRequest");

app.use(cors());
app.listen(3000, () => console.log("Listening Express on port 3000"));

const httpServer = http.createServer();
httpServer.listen(9000, () => console.log("Listening Websocket on port 9000"));
const wsServer = new websocketServer({
    "httpServer" : httpServer
});

wsServer.on("request", request => {
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log("opened!"));
    connection.on("close", () => console.log("closed!"));
    connection.on("message", message => {
        const response = JSON.parse(message.utf8Data);
        if (response.type == "newPlayer") {
            newPlayerRequest(connection, response);
        }

        if (response.type == "leaving") {
            leavingRequest(response);
        }

        if (response.type == "playerList") {
            playerListRequest(response);
        }
    });
});