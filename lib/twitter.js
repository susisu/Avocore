/*
 * Avocore : twitter.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "KeySet" : KeySet,
        "URIBase": URIBase,
        "rest"   : rest
    });
}

var request = require("request");

var actions = require("./actions.js");

function KeySet(consumerKey, consumerSecret, token, tokenSecret) {
    this.consumerKey    = consumerKey;
    this.consumerSecret = consumerSecret;
    this.token          = token;
    this.tokenSecret    = tokenSecret;
}

var URIBase = Object.freeze({
    "rest"      : "https://api.twitter.com/1.1/",
    "stream"    : "https://stream.twitter.com/1.1/",
    "userStream": "https://userstream.twitter.com/1.1/",
    "siteStream": "https://sitestream.twitter.com/1.1/",
    "media"     : "https://upload.twitter.com/1.1/"
});

function rest(keys, method, apiName, params) {
    method = method.toUpperCase();
    var options = {
        "oauth": {
            "consumer_key"   : keys.consumerKey,
            "consumer_secret": keys.consumerSecret,
            "token"          : keys.token,
            "token_secret"   : keys.tokenSecret
        },
        "method": method,
        "url"   : URIBase.rest + apiName + ".json"
    };
    switch (method) {
        case "GET":
            options["qs"] = params;
            break;
        case "POST":
            options["form"] = params;
            break;
        default:
            throw new Error("unknown request method: " + method);
    }
    return new actions.Action(function (emit) {
        request(options, function (error, response, data) {
            if (!error) {
                emit(data);
            }
            else {
                console.log(error);
            }
        });
    });
}

end_module();
