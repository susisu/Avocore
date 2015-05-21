/*
 * Avocore : actions.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "Action": Action,
        "pure"  : pure,
        "bind"  : bind,
        "then"  : then,
        "echo"  : echo,
        "cron"  : crontab
    });
}

var cron = require("cron");

var CronJob      = cron.CronJob;

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
    }
});

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

function echo(message) {
    return new Action(function (emit) {
        console.log(message);
        emit(undefined);
    });
}

function crontab(cronTime, timeZone) {
    return new Action(function (emit) {
        new CronJob({
            "cronTime": cronTime,
            "start"   : true,
            "timeZone": timeZone,
            "onTick"  : function () {
                emit(undefined);
            }
        });
    });
}

end_module();
