var express = require('express');
var router = express.Router();
const path = require('path');

router.get('/:name', function(req, res, next) {
    res.render(path.join(__dirname, '..', 'views', 'partials', 'index'), 
    	{title:req.params.name});
});

module.exports = router;