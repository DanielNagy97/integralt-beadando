const { matches, players } = require("../data/hashmaps");
const aiMoveGenerator = require("../methods/aiMoveGenerator");
const calculatePositions = require("../methods/calculatePositions");
const normalSender = require("../methods/normalSender");
const errorSender = require("../methods/errorSender");

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

    getDistanceBetweenButtons = (button1, button2) => {
        return Math.sqrt(
            (button1.pos[0] - button2.pos[0]) * (button1.pos[0] - button2.pos[0]) +
            (button1.pos[1] - button2.pos[1]) * (button1.pos[1] - button2.pos[1])
        );
    }

    // TODO: Refactoring!
    doButtonsOverlap = (button1, button2) => {
        return Math.abs((button1.pos[0] - button2.pos[0]) * (button1.pos[0] - button2.pos[0]) + (button1.pos[1] - button2.pos[1]) * (button1.pos[1] - button2.pos[1])) <= ((button1.radius + button2.radius) * (button1.radius + button2.radius))
    }

    updatePositions = (buttons) => {
        // TODO: Tune these values a little
        let ellapsedTime = 0.1;

        buttons.forEach(button => {
            button.acc[0] = -button.velocity[0] * 0.7;
            button.acc[1] = -button.velocity[1] * 0.7;

            button.velocity[0] += button.acc[0] * ellapsedTime;
            button.velocity[1] += button.acc[1] * ellapsedTime;
            button.pos[0] += button.velocity[0] * ellapsedTime;
            button.pos[1] += button.velocity[1] * ellapsedTime;

            // Wall hit
			if (button.pos[0] - button.radius < 0) {
                button.pos[0] = 0 + button.radius;
                button.velocity[0] = -button.velocity[0];
            }
			if (button.pos[0] + button.radius >= 1000) {
                button.pos[0] = 1000 - button.radius;
                button.velocity[0] = -button.velocity[0];
            }
			if (button.pos[1] - button.radius < 0) {
                button.pos[1] = 0 + button.radius;
                button.velocity[1] = -button.velocity[1];
            }
			if (button.pos[1] + button.radius >= 500) {
                button.pos[1] = 500 - button.radius;
                button.velocity[1] = -button.velocity[1];
            }

            // Stopping the button when it's velocity is close to zero
            if (Math.abs(button.velocity[0] * button.velocity[0] + button.velocity[1] * button.velocity[1]) < 0.01) {
                button.velocity[0] = 0;
                button.velocity[1] = 0;
            }
        });
    }


    calcStaticCollisions = (buttons) => {
        let collidingButtons = [];
        
        buttons.forEach(button => {
            buttons.forEach(targetButton => {
                if(!(button.id == targetButton.id && button.color == targetButton.color)) {
                    if(doButtonsOverlap(button, targetButton)) {
                        
                        collidingButtons.push({btn: button, target: targetButton});

                        let distance = getDistanceBetweenButtons(button, targetButton);
                        let overlapSize = 0.5 * (distance - button.radius - targetButton.radius);

                        // Displacing buttons from each other
                        button.pos[0] -= overlapSize * (button.pos[0] - targetButton.pos[0]) / distance;
                        button.pos[1] -= overlapSize * (button.pos[1] - targetButton.pos[1]) / distance;

                        targetButton.pos[0] += overlapSize * (button.pos[0] - targetButton.pos[0]) / distance;
                        targetButton.pos[1] += overlapSize * (button.pos[1] - targetButton.pos[1]) / distance;
                    }
                }
            });
        });

        return collidingButtons;
    }

    calcDynamicCollisions = (collidingButtons) => {
        collidingButtons.forEach(coll => {
            let distance = getDistanceBetweenButtons(coll.btn, coll.target);

            // Normal
            let nx = (coll.target.pos[0] - coll.btn.pos[0]) / distance;
            let ny = (coll.target.pos[1] - coll.btn.pos[1]) / distance;

            // Tangent
            let tx = -ny;
            let ty = nx;

            // Dot product tangent
            let dpTan1 = coll.btn.velocity[0] * tx + coll.btn.velocity[1] * ty;
            let dpTan2 = coll.target.velocity[0] * tx + coll.target.velocity[1] * ty;

            // Dot product normal
            let dpNorm1 = coll.btn.velocity[0] * nx + coll.btn.velocity[1] * ny;
            let dpNorm2 = coll.target.velocity[0] * nx + coll.target.velocity[1] * ny;

            // Conservation of momentum in 1D
            let m1 = (dpNorm1 * (coll.btn.mass - coll.target.mass) + 2.0 * coll.target.mass * dpNorm2) / (coll.btn.mass + coll.target.mass);
            let m2 = (dpNorm2 * (coll.target.mass - coll.btn.mass) + 2.0 * coll.btn.mass * dpNorm1) / (coll.btn.mass + coll.target.mass);

            // Update button velocities
            coll.btn.velocity[0] = tx * dpTan1 + nx * m1;
            coll.btn.velocity[1] = ty * dpTan1 + ny * m1;

            coll.target.velocity[0] = tx * dpTan2 + nx * m2;
            coll.target.velocity[1] = ty * dpTan2 + ny * m2;
        });
    }

    calcGoal = (ball) => {
        let isGoal = false;
        if(ball.pos[0] - ball.radius <= 0 && (ball.pos[1] > 187 && ball.pos[1] < 313)) {
            isGoal = true;
        }
        else if(ball.pos[0] + ball.radius >= 1000 && (ball.pos[1] > 187 && ball.pos[1] < 313)) {
            isGoal = true;
        }
        return isGoal;
    }

    let myMatch = matches.get(response.payload.gameId);

    gameStates = [];

    let randomIndex = Math.floor(Math.random() * 6);
    let selectedColor = myMatch.nextMove ? "blue" : "red";

    let selectedButton =  myMatch.buttons.filter(btn => {
        return btn.id == randomIndex && btn.color == selectedColor;
    })[0]

    // Shoot in the direction of the ball
    let ball = myMatch.buttons[12];
    let distance = getDistanceBetweenButtons(ball, selectedButton);
    
    // Normal
    let nx = (ball.pos[0] - selectedButton.pos[0]) / distance;
    let ny = (ball.pos[1] - selectedButton.pos[1]) / distance;

    let randomVelocity = Math.floor(Math.random() * 250 + 150);

    selectedButton.velocity = [nx * randomVelocity, ny * randomVelocity];

    let ellapsed = 0;

    // Deep copy with json stringify and parse
    gameStates.push({"gameState" : {"buttons" : JSON.parse(JSON.stringify(myMatch.buttons))}, "timestamp" : ellapsed});

    let isStopped = false;
    while(!isStopped) {

        if(calcGoal(myMatch.buttons[12])) {
            myMatch.buttons = calculatePositions.getStartingButtonPositions()
        }

        updatePositions(myMatch.buttons);
        let collided = calcStaticCollisions(myMatch.buttons);
        calcDynamicCollisions(collided);
        
        ellapsed += 10;
        gameStates.push({"gameState" : {"buttons" : JSON.parse(JSON.stringify(myMatch.buttons))}, "timestamp" : ellapsed});


        let stopCount = 0
        myMatch.buttons.forEach(button => {
            if(button.velocity[0] == 0 && button.velocity[1] == 0) {
                stopCount++;
            }
        });
        if(stopCount == myMatch.buttons.length){
            isStopped = true;
        }
    }

    matches.get(response.payload.gameId).players.forEach(element => {
        normalSender(players.get(element).connection, "move", { "gameStates": gameStates });
    });

    // TODO: Generate movement according to next move
    if (matches.get(response.payload.gameId).nextMove == 0) {
        matches.get(response.payload.gameId).nextMove = 1;
    }
    else {
        matches.get(response.payload.gameId).nextMove = 0;
    }
}