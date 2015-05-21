/*
 * Avocore : avocore.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "actions": actions,
        "utils"  : utils,
        "twitter": twitter,

        "Action": actions.Action,
        "pure"  : actions.pure,
        "bind"  : actions.bind,
        "then"  : actions.then,
        "map"   : actions.map,
        "filter": actions.filter,
        "reduce": actions.reduce,
        "merge" : actions.merge,

        "echo"            : utils.echo,
        "split"           : utils.split,
        "fromEventEmitter": utils.fromEventEmitter,
        "cron"            : utils.cron,
        "readFile"        : utils.readFile,
        "writeFile"       : utils.writeFile
    });
}

var actions = require("./actions.js"),
    utils   = require("./utils.js"),
    twitter = require("./twitter.js");

end_module();
