/*
 * Avocore / test : actions.js
 * copyright (c) 2015 Susisu
 */

"use strict";

var chai  = require("chai");

var expect = chai.expect;

var actions = require("../lib/actions.js");

describe("actions", function () {
    describe("Action", function () {
        describe("#run(callback)", function () {
            it("should run the action", function () {
                var x = false;
                var action = new actions.Action(function (emit) {
                    x = true;
                    emit(undefined);
                });
                expect(function () { action.run() }).not.to.throw(Error);
                expect(x).to.be.true;
            });

            it("should call the given function", function () {
                var action = new actions.Action(function (emit) {
                    emit(true);
                });
                action.run(function (value) {
                    expect(value).to.be.true;
                });
            });

            it("should run the action independently", function () {
                var x = (function () {
                    var arr = [];
                    var action = new actions.Action(function (emit) {
                        emit(1);
                        emit(2);
                    });
                    action.run(function (value) {
                        arr.push(value);
                    });
                    action.run(function (value) {
                        arr.push(value);
                    });
                    return arr;
                })();

                var y = (function () {
                    var arr = [];
                    new actions.Action(function (emit) {
                        emit(1);
                        emit(2);
                    }).run(function (value) {
                        arr.push(value);
                    });
                    new actions.Action(function (emit) {
                        emit(1);
                        emit(2);
                    }).run(function (value) {
                        arr.push(value);
                    });
                    return arr;
                })();

                expect(x).to.deep.equal(y);
            });
        });

        describe("#bind(func)", function () {
            it("should bind an action and a function which returns an action", function () {
                var x = false;
                var actionA = new actions.Action(function (emit) {
                    emit(true);
                });
                var func = function (value) {
                    return new actions.Action(function (emit) {
                        x = value;
                        emit(undefined);
                    });
                };
                expect(function () { actionA.bind(func).run(); }).not.to.throw(Error);
                expect(x).to.be.true;
            });
        });

        describe("#then(action)", function () {
            it("should bind two actions", function () {
                var x = [];
                var actionA = new actions.Action(function (emit) {
                    x.push(1);
                    emit(undefined);
                });
                var actionB = new actions.Action(function (emit) {
                    x.push(2);
                    emit(undefined);
                });
                expect(function () { actionA.then(actionB).run(); }).not.to.throw(Error);
                expect(x).to.deep.equal([1, 2]);
            });
        });
    });

    describe("pure(value)", function () {
        it("should create an action which emits the given value only once", function () {
            var flag = false;
            var action = actions.pure(true);
            action.run(function (value) {
                expect(flag).to.be.false;
                expect(value).to.be.true;
                flag = true;
            });
        });
    });

    it("should satisfy the monad laws", function () {
        (function () {
            var action = actions.pure(1);
            var func = function (value) {
                return new actions.Action(function (emit) {
                    emit(value);
                    emit(value * 2);
                });
            };

            var x = (function () {
                var arr = [];
                action.bind(func).run(function (value) {
                    arr.push(value);
                });
                return arr;
            })();

            var y = (function () {
                var arr = [];
                func(1).run(function (value) {
                    arr.push(value);
                });
                return arr;
            })();

            expect(x).to.deep.equal(y);
        })();

        (function () {
            var action = new actions.Action(function (emit) {
                emit(1);
                emit(2);
            });

            var x = (function () {
                var arr = [];
                action.bind(actions.pure).run(function (value) {
                    arr.push(value);
                });
                return arr;
            })();

            var y = (function () {
                var arr = [];
                action.run(function (value) {
                    arr.push(value);
                });
                return arr;
            })();

            expect(x).to.deep.equal(y);
        })();

        (function () {
            var action = new actions.Action(function (emit) {
                emit(1);
                emit(2);
            });
            var f = function (value) {
                return new actions.Action(function (emit) {
                    emit(value + 1);
                    emit(value + 2);
                });
            };
            var g = function (value) {
                return new actions.Action(function (emit) {
                    emit(value * 2);
                    emit(value * 3);
                });
            };

            var x = (function () {
                var arr = [];
                action.bind(f).bind(g).run(function (value) {
                    arr.push(value);
                });
                return arr;
            })();

            var y = (function () {
                var arr = [];
                action.bind(function (value) { return f(value).bind(g); }).run(function (value) {
                    arr.push(value);
                });
                return arr;
            })();

            expect(x).to.deep.equal(y);
        })();
    });
});
