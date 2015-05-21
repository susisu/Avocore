/*
 * Avocore : avocore.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "core"   : core,
        "actions": actions,
        "twitter": twitter,

        "Action": core.Action,
        "pure"  : core.pure,
        "bind"  : core.bind,
        "then"  : core.then,
        "map"   : core.map,
        "filter": core.filter,
        "reduce": core.reduce,
        "merge" : core.merge,

        "echo"            : actions.echo,
        "split"           : actions.split,
        "pickRandom"      : actions.pickRandom,
        "fromEventEmitter": actions.fromEventEmitter,
        "cron"            : actions.cron,
        "readFile"        : actions.readFile,
        "writeFile"       : actions.writeFile
    });
}

var core    = require("./core.js"),
    actions = require("./actions.js"),
    twitter = require("./twitter.js");

end_module();
