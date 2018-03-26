function EventTable(){
    this.evts = {};
}
EventTable.prototype.on = function(name, fn){
    var evtArr;
    if(!(name in this.evts))
        evtArr = this.evts[name] = [];
    else
        evtArr = this.evts[name];
    evtArr.push(fn);
    var _this = this;
    return function(){
        _this.off(name, fn);
    }
};
EventTable.prototype.off = function(name, fn){
    if(name in this.evts){
        if(fn){
            var evtArr = this.evt[name];
            var idx = evtArr.indexOf(fn);
            if(idx >= 0)
                evtArr.splice(idx, 1);
        }
    }else{
        delete this.evts[name];
    }
};
EventTable.prototype.trigger = function(name, args){
    if(name in this.evts){
        var evtArr = this.evts[name];
        for(var i in evtArr){
            var evtFn = evtArr[i];
            evtFn.apply({}, args);
        }
    }
};
const RequestWrapper = (function(){
    function sendRequest(method, url, data, field, callback){
        $.ajax({
            url: url,
            type: method,
            data: data,
            success: function(res){
                if(callback)
                    callback(null, field ? res[field]: res);
            },
            error: function(err){
                if(callback)
                    callback(err);
            },
            xhr: function(){
                var xhr = new XMLHttpRequest();
                xhr.addEventListener('progress', function(evt){
                    if(evt.lengthComputable){
                        var rate = evt.loaded/evt.total;
                        if(dialogProvider && dialogProvider.setProgress) {
                            dialogProvider.setProgress(rate);
                        }
                    }
                }, false);
                return xhr;
            }
        });
        return {
            Get: function(url, field, callback){
                sendRequest('GET', url, null, field, callback);
            },
            Put: function(url, data, field, callback){
                sendRequest('PUT', url, data, field, callback);
            },
            Post: function(){
                sendRequest('POST', url, data, field, callback);
            },
            Delete: function(url, field, callback){
                sendRequest('DELETE', url, null, field, callback);
            }
        }
    }
}());