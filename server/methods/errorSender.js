module.exports = function sendError(connection, errorId, errorDetails) {
    const payLoad = {
        "type": "error",
        "payload": {
            "errorId": errorId,
            "errorDetails": errorDetails
        }
    };
    connection.send(JSON.stringify(payLoad));
}