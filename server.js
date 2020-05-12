const express = require('express');
const app = express();
const http = require('http').createServer(app);
const socketIO = require('socket.io');
const io = socketIO(http);

const port = process.env.PORT || 5000;
const users = {};

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('/public/index.html', { root: __dirname });
});

io.on('connection', (socket) => {
    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });

    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});

http.listen(port, () => {
    console.log('Listening on port: ' + port);
});
