/*
 * Avocore : avocore.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "actions": require("./actions.js"),
        "twitter": require("./twitter.js")
    });
}

end_module();
