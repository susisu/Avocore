/*
 * Avocore : utils.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "echo"      : echo,
        "cron"      : crontab,
        "splitArray": splitArray,
        "parseJSON" : parseJSON
    });
}

var cron = require("cron");
var CronJob = cron.CronJob;

var actions = require("./actions.js");

function echo(message) {
    return new actions.Action(function (emit) {
        console.log(message);
        emit(undefined);
    });
}

function crontab(cronTime, timeZone) {
    return new actions.Action(function (emit) {
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

function splitArray(array) {
    return new actions.Action(function (emit) {
        array.forEach(emit);
    });
}

function parseJSON(json) {
    return new actions.Action(function (emit) {
        try {
            var data = JSON.parse(json);
            emit(data);
        }
        catch (error) {
            console.log(error);
        }
    });
}

end_module();
