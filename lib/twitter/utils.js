/*
 * Avocore : twitter/api.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "tweetRandom": tweetRandom
    });
}

var core    = require("../core.js"),
    actions = require("../actions.js"),
    api     = require("./api.js");

function tweetRandom(keys, file, separator, encoding) {
    return actions.readFile(file, encoding)
        .bind(function (content) {
            return content.toString().split(separator);
        })
        .bind(actions.pickRandom)
        .bind(function (status) {
            return api.post(keys, "statuses/update", {
                "status": status
            });
        });
}

end_module();
