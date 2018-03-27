module.exports = {
  myecho: function(socket, data){
      socket.emit('echo1', {serverResponse: data});
  }
};