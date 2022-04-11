const wallMax = [1000, 500];
const normalButtonRadius = 20;
const ballRadius = 10;
const slowing = 0.5;
const speedThreshold = 10;
const maxTime = 10;
const minTime = 1;

function vectorLength(speed) {
    return Math.sqrt(Math.pow(speed[0], 2) + Math.pow(speed[1], 2));
}

function distanceVectorOfPoints(pos1, pos2) {
    return [Math.abs(pos1[0] - pos2[0]), Math.abs(pos1[1] - pos2[1])];
}

function getRadius(button) {
    return button.id == -1 ? ballRadius : normalButtonRadius;
}

function isCollidedWithWalls(button) {
    var buttonRadius = getRadius(button);
    var returnState = 0;
    if (button.pos[0] < buttonRadius) {
        returnState = 1;
    }
    else if (button.pos[0] > (wallMax[0] - buttonRadius)) {
        returnState = 2;
    }
    else if (button.pos[1] < buttonRadius) {
        returnState = 3;
    }
    else if (button.pos[1] > (wallMax[1] - buttonRadius)) {
        returnState = 4;
    }
    return returnState;
}

function allIsCollidedWithWalls(buttons) {
    var isCollided = [];
    for (let i = 0; i < buttons.length; i++) {
        if (isCollidedWithWalls(buttons[i]) != 0) {
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
        { color: "red",   id: "0",  pos: [70, 250],  velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "red",   id: "1",  pos: [250, 160], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "red",   id: "2",  pos: [250, 340], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "red",   id: "3",  pos: [430, 70],  velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "red",   id: "4",  pos: [430, 250], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "red",   id: "5",  pos: [430, 430], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "blue",  id: "0",  pos: [930, 250], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "blue",  id: "1",  pos: [750, 160], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "blue",  id: "2",  pos: [750, 340], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "blue",  id: "3",  pos: [570, 70],  velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "blue",  id: "4",  pos: [570, 250], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "blue",  id: "5",  pos: [570, 430], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 100.0, radius: 20 },
        { color: "white", id: "-1", pos: [500, 250], velocity: [0.0, 0.0], acc: [0.0, 0.0], mass: 50.0,  radius: 10 }
    ];
}

function removeSpeed(buttons) {
    var staticButtons = [];
    for (let i = 0; i < buttons.length; i++) {
        staticButtons.push({ "color": buttons[i].color, "id": buttons[i].id, "pos": buttons[i].pos });
    }
    return staticButtons;
}

function slowSpeed(speed, ms) {
    var newSpeed = [0, 0];
    if (speed[0] > 0) {
        newSpeed[0] = speed[0] - (slowing * ms);
    }
    else if (speed[0] < 0) {
        newSpeed[0] = speed[0] + (slowing * ms);
    }
    if (newSpeed[0] < speedThreshold && newSpeed[0] > - speedThreshold) {
        newSpeed[0] = 0;
    }
    if (speed[0] > 0) {
        newSpeed[1] = speed[1] - (slowing * ms);
    }
    else if (speed[0] < 0) {
        newSpeed[1] = speed[1] + (slowing * ms);
    }
    if (newSpeed[1] < speedThreshold && newSpeed[1] > - speedThreshold) {
        newSpeed[1] = 0;
    }
    return newSpeed;
}

function movedDistance(speed, ms) {
    var distance = [0, 0];
    distance[0] = ((speed[0] / 1000) * ms);
    distance[1] = ((speed[1] / 1000) * ms);
    return distance;
}

function newPosition(pos, speed, ms) {
    var newPos = [0, 0];
    var distance = movedDistance(speed, ms);
    newPos[0] = pos[0] + distance[0];
    newPos[1] = pos[1] + distance[1];
    return newPos;
}

function moveButtonForwardInTime(button, ms) {
    return {
        "color": button.color,
        "id": button.id,
        "pos": newPosition(button.pos, button.speed, ms),
        "speed": slowSpeed(button.speed, ms)
    }
}

function jumpForwardInTime(buttons, ms) {
    var newButtons = [];
    for (let i = 0; i < buttons.length; i++) {
        newButtons.push(moveButtonForwardInTime(buttons[i], ms));
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

function fixWallHit(button, ms) {
    var lastButton = button;
    var newButton = moveButtonForwardInTime(lastButton, ms);
    var distance = movedDistance(lastButton.speed, ms);
    var toHit = [0, 0];
    var wallHit = isCollidedWithWalls(newButton);
    while (wallHit != 0) {
        switch (wallHit) {
            case 1:
                toHit[0] = getRadius(button) - lastButton.pos[0];
                toHit[1] = (toHit[0] / distance[0]) * distance[1];
                distance[0] = -1 * (distance[0] + toHit[0]);
                distance[1] = distance[1] + toHit[1];
                lastButton.pos[0] = lastButton.pos[0] + toHit[0];
                lastButton.pos[1] = lastButton.pos[1] + toHit[1];
                newButton.pos[0] = lastButton.pos[0] + distance[0];
                newButton.pos[1] = lastButton.pos[1] + distance[1];
                newButton.speed[0] = -1 * newButton.speed[0];
                break;
            case 2:
                toHit[0] = (getRadius(button) + wallMax[0]) - lastButton.pos[0];
                toHit[1] = (toHit[0] / distance[0]) * distance[1];
                distance[0] = -1 * (distance[0] + toHit[0]);
                distance[1] = distance[1] + toHit[1];
                lastButton.pos[0] = lastButton.pos[0] + toHit[0];
                lastButton.pos[1] = lastButton.pos[1] + toHit[1];
                newButton.pos[0] = lastButton.pos[0] + distance[0];
                newButton.pos[1] = lastButton.pos[1] + distance[1];
                newButton.speed[0] = -1 * newButton.speed[0];
                break;
            case 3:
                toHit[1] = getRadius(button) - lastButton.pos[1];
                toHit[0] = (toHit[1] / distance[1]) * distance[0];
                distance[1] = -1 * (distance[1] + toHit[1]);
                distance[0] = distance[0] + toHit[0];
                lastButton.pos[0] = lastButton.pos[0] + toHit[0];
                lastButton.pos[1] = lastButton.pos[1] + toHit[1];
                newButton.pos[0] = lastButton.pos[0] + distance[0];
                newButton.pos[1] = lastButton.pos[1] + distance[1];
                newButton.speed[1] = -1 * newButton.speed[1];
                break;
            case 4:
                toHit[1] = (getRadius(button) + wallMax[1]) - lastButton.pos[1];
                toHit[0] = (toHit[1] / distance[1]) * distance[0];
                distance[1] = -1 * (distance[1] + toHit[1]);
                distance[0] = distance[0] + toHit[0];
                lastButton.pos[0] = lastButton.pos[0] + toHit[0];
                lastButton.pos[1] = lastButton.pos[1] + toHit[1];
                newButton.pos[0] = lastButton.pos[0] + distance[0];
                newButton.pos[1] = lastButton.pos[1] + distance[1];
                newButton.speed[1] = -1 * newButton.speed[1];
                break;
        }
        wallHit = isCollidedWithWalls(newButton);
    }
    return newButton;
}

function fixAllWallHits(buttons, ms) {
    var newButtons = jumpForwardInTime(buttons, ms);
    for (let i = 0; i < buttons.length; i++) {
        if (isCollidedWithWalls(newButtons[i]) != 0) {
            newButtons[i] = fixWallHit(buttons[i], ms);
        }
    }
    return newButtons;
}

function findClosestWallhit(buttons) {
    var ms = maxTime;
    var realms = maxTime;
    var lastButtons = buttons;
    var newButtons = jumpForwardInTime(lastButtons, ms);
    var currentButtons;
    if (allIsCollidedWithWalls(newButtons).length != 0) {
        while (ms > minTime) {
            currentButtons = jumpForwardInTime(lastButtons, ms / 2);
            if (allIsCollidedWithWalls(currentButtons).length != 0) {
                newButtons = currentButtons;
                realms = realms - ms / 2;
            }
            else {
                lastButtons = currentButtons;
            }
            ms = ms / 2;
        }
    }
    return {"newButtons": newButtons, "realms": realms, "ms" : ms };
}

function findAndFixClosestWallHit(buttons) {
    var closestState = findClosestWallhit(buttons);
    if (closestState.ms != maxTime) {
        closestState.newButtons = fixAllWallHits(buttons, closestState.realms);
    }
    return { "newButtons": closestState.newButtons, "realms": closestState.realms };
}


exports.getStartingButtonPositions = getStartingButtonPositions;
exports.removeSpeed = removeSpeed;
exports.findAndFixClosestWallHit = findAndFixClosestWallHit;
exports.allIsStopped = allIsStopped;