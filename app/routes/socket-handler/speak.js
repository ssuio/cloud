module.exports = {
    myspeak: function(socket, data){
        socket.emit('myspeak1', {serverResponse: data+'speak'});
    }
};