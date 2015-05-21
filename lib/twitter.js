/*
 * Avocore : twitter.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "api"  : api,
        "utils": utils,

        "KeySet" : api.KeySet,
        "get"    : api.get,
        "post"   : api.post,

        "tweetRandom": utils.tweetRandom
    });
}

var api   = require("./twitter/api.js"),
    utils = require("./twitter/utils.js");

end_module();
