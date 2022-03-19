const { matches, players } = require("../data/hashmaps");
const aiMoveGenerator = require("../methods/aiMoveGenerator");
const calculatePositions = require("../methods/calculatePositions");
const normalSender = require("../methods/normalSender");

module.exports = function move(connection, response) {
    if (!players.has(response.payload.id)) {
        errorSender(connection,
            "2",
            { "id": response.payload.id });
        console.warn("No player with id " + response.payload.id + ". Move not registered.");
        return;
    }

    if (!matches.has(response.payload.gameId)) {
        const matchesIterator = matches.keys();
        var currentMatch = matchesIterator.next();

        while (!currentMatch.done) {
            if (matches.get(currentMatch.value).players.includes(response.payload.id)) {
                console.warn("Player " + response.payload.id + " tried moving in a different match. Match: " + currentMatch.value + ".Tried: " + response.payload.gameId + ".");
                errorSender(players.get(response.payload.id).connection,
                    "3",
                    { "matchId": currentMatch.value });
                return;
            }
            currentMatch = matchesIterator.next();
        }
        console.warn("No match with id " + response.payload.gameId + ".");
        errorSender(connection,
            "4",
            { "gameId": response.payload.gameId });
        return;
    }

    var currentMove;
    if (matches.get(response.payload.gameId).matchType == "ai-vs-ai") {
        if (matches.get(response.payload.gameId).nextMove == 0) {
            currentMove = aiMoveGenerator.nextMove(matches.get(response.payload.gameId).buttons, "red");
        }
        else {
            currentMove = aiMoveGenerator.nextMove(matches.get(response.payload.gameId).buttons, "blue");
        }
    }
    else if (matches.get(response.payload.gameId).matchType == "player-vs-ai") {
        if (matches.get(response.payload.gameId).nextMove == 0) {
            currentMove = response.payload.moveAction;
        }
        else {
            currentMove = aiMoveGenerator.nextMove(matches.get(response.payload.gameId).buttons, "blue");
        }
    }
    else if (matches.get(response.payload.gameId).matchType == "player-vs-player") {
        //TODO
        return;
    }

    var currentState = [];
    var timeSpent = 0;
    var gameStates = [];
    var nextState;
    matches.get(response.payload.gameId).buttons.forEach(element => {
        if (element.color == currentMove.button.color && element.id == currentMove.button.id) {
            currentState.push(
                {
                    color: currentMove.button.color,
                    id: currentMove.button.id,
                    pos: element.pos,
                    speed: currentMove.direction
                }
            )
        }
        else {
            currentState.push(element);
        }
    });

    gameStates.push({"gameState" : {"buttons" : currentState}, "timestamp" : timeSpent});

    while (calculatePositions.allIsStopped(currentState).length != 0) {
        nextState = calculatePositions.findAndFixClosestWallHit(currentState);
        currentState = nextState.newButtons;
        timeSpent += nextState.realms;
        gameStates.push({ "gameState": { "buttons": calculatePositions.removeSpeed(currentState) }, "timestamp": timeSpent });
    }

    matches.get(response.payload.gameId).players.forEach(element => {
        normalSender(players.get(element).connection, "move", { "gameStates": gameStates });
    });

    if (matches.get(response.payload.gameId).nextMove == 0) {
        matches.get(response.payload.gameId).nextMove = 1;
    }
    else {
        matches.get(response.payload.gameId).nextMove = 0;
    }

}