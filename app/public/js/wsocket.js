var WSocket = (function(){
   var client = io();
   client.on('connect', function(){
      console.log('connect');
   });
   return {
       on: function(name, cb){
           client.on(name, cb);
       },
       off: function(name, cb){
           client.off(name, cb);
       },
       send: function(name, pkg){
           client.compress(true).emit(name, pkg);
       }
   }
}());