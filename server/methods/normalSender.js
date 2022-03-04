module.exports = function sendError(connection, messageType, payload) {
    const payLoad = {
        "type": messageType,
        "payload": payload
    };
    connection.send(JSON.stringify(payLoad));
}