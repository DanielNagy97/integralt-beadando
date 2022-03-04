module.exports = function sendError(connection, errorString, errorDetails) {
    const payLoad = {
        "type": "error",
        "payload": {
            "errorString": errorString,
            "errorDetails": errorDetails
        }
    };
    connection.send(JSON.stringify(payLoad));
}