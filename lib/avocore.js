/*
 * Avocore : avocore.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "actions": actions,
        "twitter": twitter,

        "Action": actions.Action,
        "pure"  : actions.pure,
        "bind"  : actions.bind,
        "then"  : actions.then,
        "map"   : actions.map,
        "filter": actions.filter,
        "reduce": actions.reduce,
        "merge" : actions.merge,
        "echo"  : actions.echo,
        "cron"  : actions.cron
    });
}

var actions = require("./actions.js"),
    twitter = require("./twitter.js");

end_module();
