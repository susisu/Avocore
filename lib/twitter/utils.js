/*
 * Avocore : twitter/api.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end_module() {
    module.exports = Object.freeze({
        "tweetRandom"      : tweetRandom,
        "replyMentions"    : replyMentions,
        "replyHomeTimeline": replyHomeTimeline,
        "followBack"       : followBack
    });
}

var core    = require("../core.js"),
    actions = require("../actions.js"),
    api     = require("./api.js");

function showDate() {
    return "[" + (new Date()).toLocaleTimeString() + "] ";
}

function tweetRandom(keys, file, separator, encoding) {
    return actions.readFile(file, encoding)
        .map(function (content) {
            return content.toString().split(separator);
        })
        .bind(actions.pickRandom)
        .bind(function (status) {
            return api.post(keys, "statuses/update", {
                    "status": status
                })
                .then(actions.echo(showDate() + "Tweeted: " + status))
        });
}

function replyWith(keys, func) {
    return function (tweet) {
        var replyText;
        try {
            replyText = func(tweet);
        }
        catch (error) {
            console.log(error);
        }
        if (replyText !== undefined) {
            var status = "@" + tweet["user"]["screen_name"] + " " + replyText;
            return api.post(keys, "statuses/update", {
                    "status"               : status,
                    "in_reply_to_status_id": tweet["id_str"]
                })
                .then(actions.echo(showDate() + "Tweeted: " + status));
        }
        else {
            return core.pure(undefined);
        }
    };
}

function maxIdStr(x, y) {
    if (x.length > y.length) {
        return x;
    }
    else if (x.length < y.length) {
        return y;
    }
    else if (x > y) {
        return x;
    }
    else {
        return y;
    }
}

function replyMentions(keys, screenName, count, sinceId, func) {
    var params = {};
    if (count !== undefined) {
        params["count"] = count;
    }
    if (sinceId !== undefined && sinceId !== "") {
        params["since_id"] = sinceId;
    }
    return api.get(keys, "statuses/mentions_timeline", params)
        .bind(function (tweets) {
            tweets =
                tweets.filter(function (data) {
                    return data["text"]                !== undefined
                        && data["id_str"]              !== undefined
                        && data["user"]                !== undefined
                        && data["user"]["screen_name"] !== undefined
                        && data["user"]["screen_name"] !== screenName
                        && data["retweeted_status"]    === undefined;
                });
            var latestIdStr =
                tweets.map(function (data) { return data["id_str"]; })
                .reduce(maxIdStr, "0");
            return actions.split(tweets)
                .bind(replyWith(keys, func))
                .discard()
                .then(core.pure(latestIdStr));
        });
}

function replyHomeTimeline(keys, screenName, count, sinceId, func) {
    var params = {
        "exclude_replies": true
    };
    if (count !== undefined) {
        params["count"] = count;
    }
    if (sinceId !== undefined && sinceId !== "") {
        params["since_id"] = sinceId;
    }
    return api.get(keys, "statuses/home_timeline", params)
        .bind(function (tweets) {
            tweets =
                tweets.filter(function (data) {
                    return data["text"]                !== undefined
                        && data["id_str"]              !== undefined
                        && data["user"]                !== undefined
                        && data["user"]["screen_name"] !== undefined
                        && data["user"]["screen_name"] !== screenName
                        && data["retweeted_status"]    === undefined;
                });
            var latestIdStr =
                tweets.map(function (data) { return data["id_str"]; })
                .reduce(maxIdStr, "0");
            return actions.split(tweets)
                .bind(replyWith(keys, func))
                .discard()
                .then(core.pure(latestIdStr));
        });
}

function followBack(keys, screenName, count) {
    var params = {
        "screen_name": screenName
    };
    if (count !== undefined) {
        params["count"] = count;
    }
    return api.get(keys, "followers/list", params)
        .filter(function (data) {
            return data["users"] !== undefined;
        })
        .map(function (data) {
            return data["users"];
        })
        .bind(actions.split)
        .filter(function (data) {
            return data["screen_name"] !== undefined
                && data["following"]   !== undefined;
        })
        .filter(function (data) {
            return !data["following"];
        })
        .bind(function (user) {
            return api.post(keys, "friendships/create", {
                    "screen_name": user["screen_name"],
                    "follow"     : true
                })
                .then(actions.echo(showDate() + "Followed: " + user["screen_name"]));
        })
}

end_module();
