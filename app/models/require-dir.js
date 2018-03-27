function requireDir(dir) {
    var path = require('path');
    var absDir = path.join('D:\\subWorkSpace\\Nodejs\\First\\app', dir);
    var requiredObj = {};
    require('fs').readdirSync(absDir).forEach(function(file) {
        if (file.match(/\.js$/) !== null && file !== 'index.js') {
            var name = file.replace('.js', '');
            var required = require(path.join(absDir, file));
            for(var i in required) {
                requiredObj[i] = required[i];
            }
        }
    });
    return requiredObj;
}
module.exports = requireDir;