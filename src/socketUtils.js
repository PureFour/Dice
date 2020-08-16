const sendMessageToAllClients = (socket, message) => { // type MessagePayload
    console.log('sending message to all clients');
    socket.emit('gameMessage', message);
}