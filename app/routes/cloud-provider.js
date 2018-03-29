var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
   res.json({
       providers: [
           {
               name: 'ADropbox',
               provider: 'Dropbox',
               userName: 'JJ@gmail.com'
           },
           {
               name: 'AAmazon',
               provider: 'Amazon',
               userName: 'PP@gmail.com'
           }
       ]
   })
});

module.exports = router;