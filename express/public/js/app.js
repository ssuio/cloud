(function(){
    angular.module('Clouder', [])
        .controller('overviewCtrl', ['$scope', function($scope){
            $scope.a = 'apple';

            globalAppleObs = AppleObserver;
            globalObserverList = ObserverList;
            globalSubject = Subject;
            console.log($.find('#my-label'));
            function AppleObserver(name){
                this.name = name;
            }

            AppleObserver.prototype.update = function(){
                console.log('update:' + this.name);
            };

            function ObserverList(){
                this.list = [];
            }

            ObserverList.prototype.add = function(observer){
                this.list.push(observer);
            };
            ObserverList.prototype.count = function(observer){
                return this.list.length;
            };
            ObserverList.prototype.get = function(idx){
                return this.list[idx];
            };
            ObserverList.prototype.removeAt = function(idx){
                this.list.splice(idx, 1);
            };
            ObserverList.prototype.indexOf = function(observer){
                for(var i in this.list){
                    if(this.list[i] === observer ){
                        return i;
                    }
                }
                return -1;
            };

            function Subject(){
                this.observers = new ObserverList();
            }
            Subject.prototype.addObserver = function(observer){
              this.observers.add(observer);
            };
            Subject.prototype.rmObserver = function(observer){
                this.observers.removeAt(this.observers.indexOf(observer));
            };
            Subject.prototype.notify = function(){
                console.log('notify');
                console.log(this.observers);
                for(var i=0; i < this.observers.count(); i++){
                    this.observers.get(i).update();
                }
            };

            globalEventTable = EventTable;
            function EventTable(){
                this.table = {};
            }
            EventTable.prototype.$on = function(evt, callback){
                if(!this.table[evt]){
                    this.table[evt] = [];
                }
                if(typeof callback === 'function'){
                    this.table[evt].push(callback);
                }
            }
            EventTable.prototype.$emit = function(evt){
                if(!this.table[evt]) return;
                for(var idx in this.table[evt]){
                    this.table[evt][idx].apply({});
                }
            }

        }]);
}())