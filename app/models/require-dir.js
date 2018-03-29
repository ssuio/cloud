function requireDir(dir) {
    let path = require('path');
    let relativeDir = path.join('../', dir);
    let requiredObj = {};
    require('fs').readdirSync(relativeDir).forEach(function(file) {
        if (file.match(/\.js$/) !== null && file !== 'index.js') {
            let required = require(path.join(relativeDir, file));
            for(let i in required) {
                requiredObj[i] = required[i];
            }
        }
    });
    return requiredObj;
}
module.exports = requireDir;