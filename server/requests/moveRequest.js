const { matches, players } = require("../data/hashmaps");
const aiMoveGenerator = require("../methods/aiMoveGenerator");
const calculatePositions = require("../methods/calculatePositions");
const normalSender = require("../methods/normalSender");
const errorSender = require("../methods/errorSender");

isValidPlayer = (connection, response) => {
    if (!players.has(response.payload.id)) {
        errorSender(connection,
            "2",
            { "id": response.payload.id });
        console.warn("No player with id " + response.payload.id + ". Move not registered.");
        return false;
    }
    return true;
}

isValidMatch = (connection, response) => {
    if (!matches.has(response.payload.gameId)) {
        const matchesIterator = matches.keys();
        var currentMatch = matchesIterator.next();

        while (!currentMatch.done) {
            if (matches.get(currentMatch.value).players.includes(response.payload.id)) {
                console.warn("Player " + response.payload.id + " tried moving in a different match. Match: " + currentMatch.value + ".Tried: " + response.payload.gameId + ".");
                errorSender(players.get(response.payload.id).connection,
                    "3",
                    { "matchId": currentMatch.value });
                return false;
            }
            currentMatch = matchesIterator.next();
        }
        console.warn("No match with id " + response.payload.gameId + ".");
        errorSender(connection,
            "4",
            { "gameId": response.payload.gameId });
        return false;
    }
    return true;
}

sendGameStates = (myMatch, response, gameStates) => {
    myMatch.players.forEach(element => {
        normalSender(players.get(element).connection, "move", {
            "playerId": response.payload.id,
            "gameStates": gameStates,
            "score": {
                "red": myMatch.points[0],
                "blue": myMatch.points[1]
            }
        });
    });
}

module.exports = function move(connection, response) {
    if (!isValidPlayer(connection, response) || !isValidMatch(connection, response)) {
        return;
    }

    const myMatch = matches.get(response.payload.gameId);
    const updateTime = 10;

    let gameStates = [];

    let dummyMoveAction = aiMoveGenerator.generateMoveAction(myMatch.nextMove, myMatch.buttons);
    let selectedButton = calculatePositions.findButton(myMatch.buttons, dummyMoveAction.button.id, dummyMoveAction.button.color);
    selectedButton.velocity = dummyMoveAction.direction;

    let ball = calculatePositions.findButton(myMatch.buttons, "-1", "white");

    let ellapsedTime = 0;
    // First frame, deep copy with json stringify and parse
    gameStates.push({ "gameState": { "buttons": JSON.parse(JSON.stringify(myMatch.buttons)) }, "timestamp": ellapsedTime });

    let isStopped = false;
    while (!isStopped) {
        let goal = calculatePositions.calcGoal(ball)
        if (goal != "none") {
            myMatch.buttons = calculatePositions.getStartingButtonPositions();
            goal == "red" ? myMatch.points[0]++ : myMatch.points[1]++;
            ellapsedTime += updateTime * 100;
            // Sending the goal frame and the starting position frame to the client!
        }

        calculatePositions.updatePositions(myMatch.buttons, updateTime);
        let collided = calculatePositions.calcStaticCollisions(myMatch.buttons);
        calculatePositions.calcDynamicCollisions(collided);

        ellapsedTime += updateTime;
        gameStates.push(
            {
                "gameState": {
                    "buttons": JSON.parse(JSON.stringify(myMatch.buttons))
                },
                "timestamp": ellapsedTime
            }
        );

        let stopCount = 0
        myMatch.buttons.forEach(button => {
            if (button.velocity[0] == 0 && button.velocity[1] == 0) {
                stopCount++;
            }
        });
        if (stopCount == myMatch.buttons.length) {
            isStopped = true;
        }
    }

    sendGameStates(myMatch, response, gameStates);

    myMatch.nextMove = myMatch.nextMove == 0 ? 1 : 0;
}