/*
 * Avocore : core.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "Action" : Action,
        "pure"   : pure,
        "bind"   : bind,
        "then"   : then,
        "map"    : map,
        "filter" : filter,
        "reduce" : reduce,
        "merge"  : merge,
        "discard": discard
    });
}

function Action(func) {
    Object.defineProperties(this, {
        "__Action__func__": {
            "value": func
        }
    });
}

Action.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value": Action
    },
    "run": {
        "writable"    : true,
        "configurable": true,
        "value": function (callback) {
            this["__Action__func__"].call(
                undefined,
                function (value) {
                    if (typeof callback === "function") {
                        callback(value);
                    }
                }
            );
        }
    },
    "bind": {
        "writable"    : true,
        "configurable": true,
        "value": function (func) {
            var action = this;
            return new Action(function (emit) {
                action.run(function (value) {
                    func(value).run(emit);
                });
            });
        }
    },
    "then": {
        "writable"    : true,
        "configurable": true,
        "value": function (actionB) {
            var actionA = this;
            return new Action(function (emit) {
                actionA.run(function (valueA) {
                    actionB.run(emit);
                });
            });
        }
    },
    "map": {
        "writable"    : true,
        "configurable": true,
        "value": function (func) {
            var action = this;
            return new Action(function (emit) {
                action.run(function (value) {
                    emit(func(value));
                });
            });
        }
    },
    "filter": {
        "writable"    : true,
        "configurable": true,
        "value": function (func) {
            var action = this;
            return new Action(function (emit) {
                action.run(function (value) {
                    if (func(value)) {
                        emit(value);
                    }
                });
            });
        }
    },
    "reduce": {
        "writable"    : true,
        "configurable": true,
        "value": function (func, initValue) {
            var action = this;
            return new Action(function (emit) {
                var acc = initValue;
                action.run(function (value) {
                    acc = func(acc, value);
                    emit(acc);
                });
            });
        }
    },
    "merge": {
        "writable"    : true,
        "configurable": true,
        "value": function (actionB) {
            var actionA = this;
            return new Action(function (emit) {
                actionA.run(emit);
                actionB.run(emit);
            });
        }
    },
    "discard": {
        "writable"    : true,
        "configurable": true,
        "value": function () {
            var action = this;
            return new Action(function (emit) {
                action.run();
                emit(undefined);
            });
        }
    }
});

function run(action, callback) {
    return action.run(callback);
}

function pure(value) {
    return new Action(function (emit) {
        emit(value);
    });
}

function bind(action, func) {
    return action.bind(func);
}

function then(actionA, actionB) {
    return actionA.then(actionB);
}

function map(func) {
    return function (action) {
        return action.map(func);
    };
}

function filter(func) {
    return function (action) {
        return action.filter(func);
    };
}

function reduce(action, func, initValue) {
    return action.reduce(func, initValue);
}

function merge(actionA, actionB) {
    return actionA.merge(actionB);
}

function discard(action) {
    return action.discard();
}

end_module();
