const socketIO = require('socket.io');

function initializeSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: "*", // Allow all origins
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected');

        // Remove or comment out the dummy data emission
        // setInterval(() => {
        //     const dummyData = {
        //         booking_id: Math.floor(Math.random() * 1000),
        //         message: 'Dummy booking data'
        //     };
        //     socket.emit('new-taxi-booking', dummyData);
        // }, 5000);

        socket.on('message', (data) => {
            console.log('Message from client:', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
}

module.exports = initializeSocket;
