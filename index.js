const io = require('socket.io')(8000, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
        io.emit('update-user-list', Object.values(users));
    });

    socket.on('send', message => {
        if (users[socket.id]) {
            socket.broadcast.emit('receive',
                { message: message, name: users[socket.id] });
        }
    });

    socket.on('disconnect', message => {
        if (users[socket.id]) {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id];
            io.emit('update-user-list', Object.values(users));
        }
    });

});