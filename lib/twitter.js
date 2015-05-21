/*
 * Avocore : twitter.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "KeySet" : KeySet,
        "get"    : get,
        "post"   : post,

        "getHomeTimeline" : getHomeTimeline,
        "getMentions"     : getMentions,
        "getFollowersList": getFollowersList,
        "updateStatus"    : updateStatus,
        "createFriendship": createFriendship
    });
}

var Twitter = require("twitter");

var actions = require("./actions.js"),
    utils   = require("./utils.js");

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
    return new actions.Action(function (emit) {
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
    return new actions.Action(function (emit) {
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

function getHomeTimeline(keys, params) {
    return get(keys, "statuses/home_timeline", params);
}

function getMentions(keys, params) {
    return get(keys, "statuses/mentions_timeline", params);
}

function getFollowersList(keys, params) {
    return get(keys, "followers/list", params);
}

function updateStatus(keys, params) {
    return post(keys, "statuses/update", params);
}

function createFriendship(keys, params) {
    return post(keys, "friendships/create", params);
}

end_module();
