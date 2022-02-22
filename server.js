const express = require('express');
const mongoose = require('mongoose');
const Filter = require('bad-words');
const { Server } = require('socket.io');
const { createServer } = require('http');
const { createMessage, renderMessage } = require('./app/src/utils/create-message');
const { getUserList, addUserList, removeUserList } = require('./app/src/utils/users');
const { router } = require('./app/src/routers/user.api')
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })

/* Config Data Base */
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
const localDB = 'mongodb://localhost:27017/chatApp'
mongoose.connect(localDB)
    .then(() => { console.log("DB connecttion success") })
    .catch((err) => console.log(err))

/* express (app)*/
const app = express();
app.use(express());
const httpServer = createServer(app)
const io = new Server(httpServer, {/**option */ })

/* Socket IO */
io.on('connection', (socket) => {
    /**reciver join room */
    socket.on('join room', ({ userName, room, email }) => {
        socket.join(room)
        /** add client join room */
        io.to(room).emit('add client join room', addUserList({ userName, room, email }))
        /** notify */
        socket.emit('send message notify', `Well Come ${userName} Join Room ${room}`)
        /** send message to new client after join */
        socket.broadcast.to(room).emit('send message notify', `${userName} Joining`)
        /** render client inside room */
        io.to(room).emit('send list client inside room', getUserList(room));

        /** chat */
        socket.on('send message', (message, callBackAcknow) => {
            const filter = new Filter()
            const textBad = ['con cặc', 'địt mẹ', 'đụ má', 'chó đẻ', 'cặc']
            filter.addWords(...textBad)
            // const sendSuccess = 200;
            if (filter.isProfane(message)) {
                let returnText = filter.clean(message);
                io.to(room).emit('send message', renderMessage(returnText))
                return callBackAcknow('Message Not Available')
            }
            // save database
            setTimeout(() => {
                io.to(room).emit('send message', createMessage({ message, email, userName }))
            }, 1000);
            setTimeout(() => {
                io.to(room).emit('send array message', renderMessage({ message, email, userName }))
            }, 1000);
            callBackAcknow()
        })
        /** location */
        socket.on('send location', (location) => {
            if (location) {
                const linkLocation = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
                io.to(room).emit('server send location', linkLocation)
                io.to(room).emit('send array message', renderMessage({ message: linkLocation, email, userName }))
            }
        })

        /**disconnect socket io */
        socket.on('disconnect', () => {
            console.log(`client ${socket.id} Disonected`);
            removeUserList(socket.id)
            /** render client inside room */
            io.to(room).emit('send list client inside room', getUserList(room));
        })
    })
})

/* Config Request to JSON */
app.use(express.json());

/*Config API */
app.use('/api/v1/listUser', router)
const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
    console.log(`Well Come App Chat_Socket_IO on port : ${port}`)
})