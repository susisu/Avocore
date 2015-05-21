/*
 * Avocore : actions.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "echo"            : echo,
        "split"           : split,
        "pickRandom"      : pickRandom,
        "fromEventEmitter": fromEventEmitter,
        "cron"            : crontab,
        "readFile"        : readFile,
        "writeFile"       : writeFile
    });
}

var fs   = require("fs"),
    cron = require("cron");

var CronJob = cron.CronJob;

var core = require("./core.js");

function echo(message) {
    return new core.Action(function (emit) {
        console.log(message);
        emit(undefined);
    });
}

function split(array) {
    return new core.Action(function (emit) {
        array.forEach(emit);
    });
}

function pickRandom(array) {
    return new core.Action(function (emit) {
        if (array.length > 0) {
            emit(array[Math.floor(Math.random() * array.length)]);
        }
    });
}

function fromEventEmitter(emitter, event) {
    return new core.Action(function (emit) {
        emitter.on(event, function () {
            emit.apply(undefined, arguments);
        });
    });
}

function crontab(cronTime, timeZone) {
    return new core.Action(function (emit) {
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

function readFile(file, encoding) {
    return new core.Action(function (emit) {
        fs.readFile(file, { "encoding": encoding }, function (error, content) {
            if (!error) {
                emit(content);
            }
            else {
                console.log(error);
            }
        });
    });
}

function writeFile(file, content, encoding) {
    return new core.Action(function (emit) {
        fs.writeFile(file, content, { "encoding": encoding }, function (error) {
            if (!error) {
                emit(undefined);
            }
            else {
                console.log(error);
            }
        });
    });
}

end_module();
