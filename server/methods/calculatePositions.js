
getStartingButtonPositions = () => {
    return [
        { color: "red", id: "0", pos: [70, 250], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "red", id: "1", pos: [250, 160], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "red", id: "2", pos: [250, 340], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "red", id: "3", pos: [430, 70], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "red", id: "4", pos: [430, 250], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "red", id: "5", pos: [430, 430], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "blue", id: "0", pos: [930, 250], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "blue", id: "1", pos: [750, 160], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "blue", id: "2", pos: [750, 340], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "blue", id: "3", pos: [570, 70], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "blue", id: "4", pos: [570, 250], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "blue", id: "5", pos: [570, 430], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "white", id: "-1", pos: [500, 250], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 50.0, radius: 10 }
    ];
}

findButton = (buttons, id, color) => {
    return buttons.filter(btn => {
        return btn.id == id && btn.color == color;
    })[0];
}

getDistanceBetweenButtons = (button1, button2) => {
    return Math.sqrt(
        (button1.pos[0] - button2.pos[0]) * (button1.pos[0] - button2.pos[0]) +
        (button1.pos[1] - button2.pos[1]) * (button1.pos[1] - button2.pos[1])
    );
}

doButtonsOverlap = (button1, button2) => {
    return Math.abs(
        (button1.pos[0] - button2.pos[0]) * (button1.pos[0] - button2.pos[0]) +
        (button1.pos[1] - button2.pos[1]) * (button1.pos[1] - button2.pos[1])) <= ((button1.radius + button2.radius) * (button1.radius + button2.radius))
}

checkWalls = (button) => {
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
}

updatePositions = (buttons, updateTime) => {
    // TODO: Tune these values a little
    let ellapsedTime = updateTime * 0.01;

    buttons.forEach(button => {
        button.acc[0] = -button.velocity[0] * 0.7;
        button.acc[1] = -button.velocity[1] * 0.7;

        button.velocity[0] += button.acc[0] * ellapsedTime;
        button.velocity[1] += button.acc[1] * ellapsedTime;
        button.pos[0] += button.velocity[0] * ellapsedTime;
        button.pos[1] += button.velocity[1] * ellapsedTime;

        checkWalls(button);

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
            if (!(button.id == targetButton.id && button.color == targetButton.color)) {
                if (doButtonsOverlap(button, targetButton)) {

                    collidingButtons.push({ btn: button, target: targetButton });

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
    let isGoal = "none";
    if (ball.pos[0] - ball.radius <= 0 && (ball.pos[1] > 187 && ball.pos[1] < 313)) {
        isGoal = "blue";
    }
    else if (ball.pos[0] + ball.radius >= 1000 && (ball.pos[1] > 187 && ball.pos[1] < 313)) {
        isGoal = "red";
    }
    return isGoal;
}

exports.getDistanceBetweenButtons = getDistanceBetweenButtons;
exports.updatePositions = updatePositions;
exports.calcStaticCollisions = calcStaticCollisions;
exports.calcDynamicCollisions = calcDynamicCollisions;
exports.calcGoal = calcGoal;
exports.getStartingButtonPositions = getStartingButtonPositions;
exports.findButton = findButton;