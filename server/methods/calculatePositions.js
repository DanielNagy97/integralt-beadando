const wallMax = [1000, 500];
const normalButtonRadius = 20;
const ballRadius = 10;
const slowing = 0.5;
const speedThreshold = 10;

function vectorLength(speed) {
    return Math.sqrt(Math.pow(speed[0], 2) + Math.pow(speed[1], 2));
}

function distanceVectorOfPoints(pos1, pos2) {
    return [Math.abs(pos1[0] - pos2[0]), Math.abs(pos1[1] - pos2[1])];
}

function isCollidedWithWalls(button) {
    var buttonRadius = normalButtonRadius;
    if (button.id == -1) {
        buttonRadius = ballRadius;
    }
    return button.pos[0] <= buttonRadius
        || button.pos[0] >= (wallMax[0] - buttonRadius)
        || button.pos[1] <= buttonRadius
        || button.pos[1] >= (wallMax[1] - buttonRadius);
}

function allIsCollidedWithWalls(buttons) {
    var isCollided = [];
    for (let i = 0; i < buttons.length; i++) {
        if (isCollidedWithWalls(buttons[i])) {
            isCollided.push(i);
        }
    }
    return isCollided;
}

function isCollidedWithButtons(button1, button2) {
    var minDistance = 2 * normalButtonRadius;
    if (button1.id == -1 || button2.id == -1) {
        minDistance = normalButtonRadius + ballRadius;
    }

    return vectorLength(distanceVectorOfPoints(button1.pos, button2.pos)) <= minDistance;
}

function allIsCollidedWithButtons(buttons) {
    var isCollided = [];
    for (let i = 0; i < buttons.length; i++) {
        for (let j = i + 1; j < buttons.length; j++) {
            if (isCollidedWithButtons(buttons[i], buttons[j])) {
                isCollided.push([i, j]);
            }
        }
    }
    return isCollided;
}

function getStartingButtonPositions() {
    return [
        { color: "red", id: "0", pos: [70, 250], speed: [0, 0] },
        { color: "red", id: "1", pos: [250, 160], speed: [0, 0] },
        { color: "red", id: "2", pos: [250, 340], speed: [0, 0] },
        { color: "red", id: "3", pos: [430, 70], speed: [0, 0] },
        { color: "red", id: "4", pos: [430, 250], speed: [0, 0] },
        { color: "red", id: "5", pos: [430, 430], speed: [0, 0] },
        { color: "blue", id: "0", pos: [930, 250], speed: [0, 0] },
        { color: "blue", id: "1", pos: [750, 160], speed: [0, 0] },
        { color: "blue", id: "2", pos: [750, 340], speed: [0, 0] },
        { color: "blue", id: "3", pos: [570, 70], speed: [0, 0] },
        { color: "blue", id: "4", pos: [570, 250], speed: [0, 0] },
        { color: "blue", id: "5", pos: [570, 430], speed: [0, 0] },
        { color: "white", id: "-1", pos: [500, 250], speed: [0, 0] }
    ];
}

function removeSpeed(buttons) {
    var staticButtons = [];
    for (let i = 0; i < buttons.length; i++) {
        staticButtons.push({ "color": buttons[i].color, "id": buttons[i].id, "pos": buttons[i].pos });
    }
    return staticButtons;
}

function jumpForwardInTime(buttons, ms) {
    var newButtons = [];
    var newPos = [0, 0];
    var newSpeed = [0, 0];
    for (let i = 0; i < buttons.length; i++) {
        newPos[0] = buttons[i].pos[0] + (buttons[i].speed[0] / 1000);
        newPos[1] = buttons[i].pos[1] + (buttons[i].speed[1] / 1000);
        if (buttons[i].speed[0] > 0) {
            newSpeed[0] = buttons[i].speed[0] - (slowing * ms);
        }
        else if (buttons[i].speed[0] < 0) {
            newSpeed[0] = buttons[i].speed[0] + (slowing * ms);
        }
        if (newSpeed[0] < speedThreshold && newSpeed[0] > - speedThreshold) {
            newSpeed[0] = 0;
        }
        if (buttons[i].speed[0] > 0) {
            newSpeed[1] = buttons[i].speed[1] - (slowing * ms);
        }
        else if (buttons[i].speed[0] < 0) {
            newSpeed[1] = buttons[i].speed[1] + (slowing * ms);
        }
        if (newSpeed[1] < speedThreshold && newSpeed[1] > - speedThreshold) {
            newSpeed[1] = 0;
        }
        newButtons.push({
            "color": buttons[i].color,
            "id": buttons[i].id,
            "pos": newPos,
            "speed": newSpeed
        });
    }
    return newButtons;
}

function allIsStopped(buttons) {
    var isStopped = [];
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].speed[0] != 0 || buttons[i].speed[1] != 0) {
            isStopped.push(i);
        }
    }
    return isStopped;
}



exports.isCollidedWithWalls = isCollidedWithWalls;
exports.allIsCollidedWithWalls = allIsCollidedWithWalls;
exports.isCollidedWithButtons = isCollidedWithButtons;
exports.allIsCollidedWithButtons = allIsCollidedWithButtons;
exports.getStartingButtonPositions = getStartingButtonPositions;
exports.removeSpeed = removeSpeed;
exports.jumpForwardInTime = jumpForwardInTime;
exports.allIsStopped = allIsStopped;