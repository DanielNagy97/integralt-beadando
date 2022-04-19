const calculatePositions = require("../methods/calculatePositions");

const minForce = 150;
const maxForce = 250;

generateVelocity = (selectedButton, ball) => {
    let distance = calculatePositions.getDistanceBetweenButtons(ball, selectedButton);

    // Normal
    let nx = (ball.pos[0] - selectedButton.pos[0]) / distance;
    let ny = (ball.pos[1] - selectedButton.pos[1]) / distance;

    let randomVelocity = Math.floor(Math.random() * maxForce + minForce);

    return [nx * randomVelocity, ny * randomVelocity];
}

generateMoveAction = (nextMove, buttons) => {
    const randomIndex = Math.floor(Math.random() * 6);
    const selectedColor = nextMove ? "blue" : "red";

    let selectedButton = calculatePositions.findButton(buttons, randomIndex, selectedColor);
    let ball = calculatePositions.findButton(buttons, "-1", "white");
    let velocity = generateVelocity(selectedButton, ball);

    let moveAction = {
        button: { color: selectedColor, id: randomIndex },
        direction: velocity
    }

    return moveAction;
}

exports.generateMoveAction = generateMoveAction;