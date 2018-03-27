(function () {
    angular.module('gs')
        .service('accountAPI', ['Tool', function (Tool) {
            var BASE_URL = '/cmd/account/{0}';
            var ACCOUNT_URLS = {
                ADD: 'addAdmin',
                DELETE: 'deleteAdmin',
                EDIT: 'editAccount',
                CHANGE_PW: 'changePWD',
                INFO: 'getList',
                CHECK_PERMISSION: 'checkAccountPermission'
            };

            function getUrl(name) {
                return BASE_URL.format(name);
            }

            function initService(service) {
                service.checkPermission = function(callback){
                    Tool.httpGet(getUrl(ACCOUNT_URLS.CHECK_PERMISSION), function(res){
                        if(res.status == 'success'){
                            callback(null, res);
                        }else{
                            callback(res);
                        }
                    }, function(res){
                        callback(res);
                    });
                }
            }
            initService(this);
        }]);
}());