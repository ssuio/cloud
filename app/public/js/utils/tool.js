function EventTable() {
    this.evts = {};
}

EventTable.prototype.on = function (name, fn) {
    var evtArr;
    if (!(name in this.evts))
        evtArr = this.evts[name] = [];
    else
        evtArr = this.evts[name];
    evtArr.push(fn);
    var _this = this;
    return function () {
        _this.off(name, fn);
    };
};
EventTable.prototype.off = function (name, fn) {
    if (name in this.evts) {
        if (fn) {
            var evtArr = this.evt[name];
            var idx = evtArr.indexOf(fn);
            if (idx >= 0)
                evtArr.splice(idx, 1);
        }
    } else {
        delete this.evts[name];
    }
};
EventTable.prototype.trigger = function (name, args) {
    if (name in this.evts) {
        var evtArr = this.evts[name];
        for (var i in evtArr) {
            var evtFn = evtArr[i];
            evtFn.apply({}, args);
        }
    }
};
var Utils = {
    compileJade: function (jadeText) {
        return jade.compile(jadeText)();
    },
    compileJadeArryToHtml: function (jadeArray) {
        return Utils.compileJade(jadeArray.join());
    },
    normalizeDirectiveName: function (directiveName) {
        return directiveName.replace(/([A-Z])/g, function (matched) {
            return '-' + matched.toLowerCase();
        });
    }
};
var ComponentUtils = {
    createComponentBuilder: function (moduleName) {
        var module = angular.module(moduleName);
        return {
            createAngularJadeComponent: function (name, options) {
                var directiveArray = ['$timeout', '$compile'];
                var injected = options.injected;
                delete options.injected;

                function controller() {
                    var allInjected = arguments;
                    return {
                        restrict: 'E',
                        replace: true,
                        template: Utils.compileJadeArryToHtml(options.template),
                        scope: {
                            control: '='
                        },
                        link: function (scope, element) {
                            var jElm = $(element);
                            var injectedModules = {};
                            if (injected) {
                                for (var i in injected) {
                                    injectedModules[injected[i]] = allInjected[parseInt(i) + 2];
                                }
                            }

                            function apply(callback) {
                                $timeout(function () {
                                    if (callback)
                                        callback();
                                    scope.$apply();
                                });
                            }

                            var evtObjs = new EventTable();

                            function removeComponent() {
                                evtObjs.trigger('destroy');
                                jElm.remove();
                            }

                            function onDestroy(callback) {
                                evtObjs.on('$destroy', function () {
                                    if (callback)
                                        callback();
                                });
                            }

                            function compile(directiveName, ctrl) {
                                var newScope = scope.$new(true);
                                newScope.control = ctrl;
                                return $compile(Utils.compileJade(Utils.normalizeDirectiveName(directiveName) + '(control="control")'))(newScope);
                            }

                            var keyEvents = [];
                            var kbCancelEvent;

                            function onKey(keyCode, callback) {
                                var onKeyDown = function (evt) {
                                    callback();
                                    evt.preventDefault();
                                    evt.stopPropagation();
                                    return false;
                                };
                                $(document).on('keydown', onKeyDown);
                                keyEvents.push(onKeyDown);
                                return onKeyDown;
                            }

                            onDestroy(function () {
                                for (var i in keyEvents) {
                                    $(document).off('keydown', keyEvents[i]);
                                }
                            });

                            function popupDialog(directiveName, ctrlScope) {
                                $(document).off('keydown', kbCancelEvent);
                                ctrlScope.onClose = function () {
                                    $(document).on('keydown', kbCancelEvent);
                                    if (options.dialogMode) {
                                        jElm.show();
                                    }
                                    if (options.dialogMode) {
                                        jElm.hide();
                                        ctrlScope.__donotAnim = true;
                                    }
                                    $('body').append(builder.compile(directiveName, ctrlScope));
                                };
                            }

                            var isCanceling = false;

                            function cancel() {
                                if (isCanceling) return;
                                if (scope.control.onClose) {
                                    scope.control.onClose();
                                }
                                if (options.dialogMode) {
                                    if (scope.control.__donotAnim) {
                                        removeComponent();
                                    } else {
                                        builder.$('#dialog').removeClass('in');
                                        builder.$('#dialog').removeClass('out');
                                        $timeout(function () {
                                            removeComponent();
                                        }, 150);
                                    }
                                } else {
                                    jElm.remove();
                                }
                            }

                            function popupProgressDialog(keepWhenSuccess) {
                                var ctrl = {
                                    onSuccess: function () {
                                        if (!keepWhenSuccess)
                                            cancel();
                                    },
                                    onFailed: function () {
                                        jElm.show();
                                    }
                                };
                                builder.popupDialog('progressDialog', ctrl);
                                return ctrl.dialogCtrl;
                            }

                            var builder = {
                                apply: apply,
                                onDestroy: onDestroy,
                                compile: compile,
                                onKey: onKey,
                                popupDialog: popupDialog,
                                injected: injectedModules,
                                $: function (query) {
                                    return jElm.find(query);
                                },
                                popupProgressDialog:popupProgressDialog,
                                timeout:$timeout
                            };
                            scope.cancel = cancel;
                            if (options.dialogMode) {
                                jElm.draggable({handle: ".modal-header"});
                                kbCancelEvent = builder.onKey(27, function () {
                                    cancel();
                                });
                                if (scope.control && scope.control.__donotAnim) {
                                    builder.$('#dialog').css({opacity: 0.5});
                                } else {
                                    builder.$('#dialog').addClass('in');
                                }
                            }
                            builder.apply(function () {
                                var firstInputElem = builder.$('input');
                                if (firstInputElem.length > 0) {
                                    builder.$('input')[0].focus();
                                }
                            });
                            options.link(scope, element, builder);
                        }
                    };
                }

                if (injected) {
                    directiveArray = directiveArray.concat(injected);
                }
                directiveArray.push(controller);
                return module.directive(name, directiveArray);
            }
        };
    }
};
var RequestWrapper = (function () {
    function sendRequest(method, url, data, field, callback) {
        $.ajax({
            url: url,
            type: method,
            data: data,
            success: function (res) {
                if (callback)
                    callback(null, field ? res[field] : res);
            },
            error: function (err) {
                if (callback)
                    callback(err);
            },
            xhr: function () {
                var xhr = new XMLHttpRequest();
                xhr.addEventListener('progress', function (evt) {
                    if (evt.lengthComputable) {
                        var rate = evt.loaded / evt.total;
                        if (dialogProvider && dialogProvider.setProgress) {
                            dialogProvider.setProgress(rate);
                        }
                    }
                }, false);
                return xhr;
            }
        });
        return {
            Get: function (url, field, callback) {
                sendRequest('GET', url, null, field, callback);
            },
            Put: function (url, data, field, callback) {
                sendRequest('PUT', url, data, field, callback);
            },
            Post: function () {
                sendRequest('POST', url, data, field, callback);
            },
            Delete: function (url, field, callback) {
                sendRequest('DELETE', url, null, field, callback);
            }
        };
    }
}());