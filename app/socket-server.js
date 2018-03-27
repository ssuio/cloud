var socketio = require('socket.io');
var session = require('./session');
var sharedsession = require('express-socket.io-session');
var requireDir = require('./models/require-dir');
var socketHandler = requireDir('./routes/socket-handler');

function startServer(server){
    var io = socketio(server);
    const SocketIOEvent = {
        Connect: 'connection',
        Disconnect: 'disconnect'
    }
    io.use(sharedsession(session, {
        autoSave: true
    }));
    function listenHandler(socket, name, handler){
        socket.on(name, function(data){
            handler(socket, data);
        });
    }
    io.on(SocketIOEvent.Connect, function(socket){
        for(var key in socketHandler){
            listenHandler(socket, key, socketHandler[key]);
        }
        socket.on(SocketIOEvent.Disconnect, function(reason){
            if(reason === 'transport close'){
                console.log('disconnected from server:'+reason)
            } else {

            }
        })
    })
}

module.exports = {
    startServer:startServer
};