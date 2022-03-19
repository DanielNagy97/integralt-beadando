const maxSpeed = 1000;

function nextMove(gameState, aiColor) {
    const choice = Math.floor(Math.random() * 6);
    const speedX = Math.floor(Math.random() * maxSpeed);
    const speedY = Math.floor(Math.random() * maxSpeed);
    return { "button": {"color" : aiColor, "id" : choice.toString()}, "direction": [speedX, speedY] };
}

exports.nextMove = nextMove;