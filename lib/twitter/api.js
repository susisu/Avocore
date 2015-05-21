/*
 * Avocore : twitter/api.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "KeySet" : KeySet,
        "get"    : get,
        "post"   : post
    });
}

var Twitter = require("twitter");

var core = require("../core.js");

function KeySet(consumerKey, consumerSecret, token, tokenSecret) {
    this.consumerKey    = consumerKey;
    this.consumerSecret = consumerSecret;
    this.token          = token;
    this.tokenSecret    = tokenSecret;
}

function get(keys, path, params) {
    var client = new Twitter({
      "consumer_key"       : keys.consumerKey,
      "consumer_secret"    : keys.consumerSecret,
      "access_token_key"   : keys.token,
      "access_token_secret": keys.tokenSecret
    });
    return new core.Action(function (emit) {
        client.get(path, params, function (error, data, response) {
            if (!error) {
                emit(data);
            }
            else {
                console.log(error);
            }
        });
    });
}

function post(keys, path, params) {
    var client = new Twitter({
      "consumer_key"       : keys.consumerKey,
      "consumer_secret"    : keys.consumerSecret,
      "access_token_key"   : keys.token,
      "access_token_secret": keys.tokenSecret
    });
    return new core.Action(function (emit) {
        client.post(path, params, function (error, data, response) {
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
