/*
 * Avocore : twitter.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "api": api,
        
        "KeySet" : api.KeySet,
        "get"    : api.get,
        "post"   : api.post
    });
}

var api = require("./twitter/api.js");

end_module();
