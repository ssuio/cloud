const session = require('express-session')({
    secret: 'a secret str',
    resave: true,
    saveUninitialized: true
});

module.exports = session;