/*
 * Avocore / test : core.js
 * copyright (c) 2015 Susisu
 */

"use strict";

var chai  = require("chai");

var expect = chai.expect;

var core = require("../lib/core.js");

describe("core", function () {
    describe("Action", function () {
        describe("#run(callback)", function () {
            it("should run the action", function () {
                var x = false;
                var action = new core.Action(function (emit) {
                    x = true;
                    emit(undefined);
                });
                expect(function () { action.run() }).not.to.throw(Error);
                expect(x).to.be.true;
            });

            it("should call the given function", function () {
                var action = new core.Action(function (emit) {
                    emit(true);
                });
                action.run(function (value) {
                    expect(value).to.be.true;
                });
            });

            it("should run the action independently", function () {
                var x = (function () {
                    var arr = [];
                    var action = new core.Action(function (emit) {
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
                    new core.Action(function (emit) {
                        emit(1);
                        emit(2);
                    }).run(function (value) {
                        arr.push(value);
                    });
                    new core.Action(function (emit) {
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
            it("should bind the action and the given function which returns an action", function () {
                var x = false;
                var actionA = new core.Action(function (emit) {
                    emit(true);
                });
                var func = function (value) {
                    return new core.Action(function (emit) {
                        x = value;
                        emit(undefined);
                    });
                };
                expect(function () { actionA.bind(func).run(); }).not.to.throw(Error);
                expect(x).to.be.true;
            });
        });

        describe("#then(action)", function () {
            it("should bind the action and the given action", function () {
                var x = [];
                var actionA = new core.Action(function (emit) {
                    x.push(1);
                    emit(undefined);
                });
                var actionB = new core.Action(function (emit) {
                    x.push(2);
                    emit(undefined);
                });
                expect(function () { actionA.then(actionB).run(); }).not.to.throw(Error);
                expect(x).to.deep.equal([1, 2]);
            });
        });

        describe("#map(func)", function () {
            it("should map the given function to each emitted values", function () {
                var action = new core.Action(function (emit) {
                    emit(1);
                    emit(2);
                });
                var x = [];
                action
                    .map(function (value) { return value * 2; })
                    .run(function (value) {
                        x.push(value);
                    });
                expect(x).to.deep.equal([2, 4]);
            });
        });

        describe("#filter(func)", function () {
            it("should filter each emitted values by the given function", function () {
                var action = new core.Action(function (emit) {
                    emit(1);
                    emit(2);
                    emit(3);
                    emit(4);
                });
                var x = [];
                action
                    .filter(function (value) { return value % 2 == 0; })
                    .run(function (value) {
                        x.push(value);
                    });
                expect(x).to.deep.equal([2, 4]);
            });
        });

        describe("#reduce(func, initValue)", function () {
            it("shoud accumulate emitted values by the given function", function () {
                var action = new core.Action(function (emit) {
                    emit(1);
                    emit(2);
                    emit(3);
                    emit(4);
                });
                var x = [];
                action
                    .reduce(function (accum, value) { return accum + value; }, 0)
                    .run(function (value) {
                        x.push(value);
                    });
                expect(x).to.deep.equal([1, 3, 6, 10]);
            });
        });

        describe("#merge(action)", function () {
            it("should merge the action and the given action", function () {
                var actionA = new core.Action(function (emit) {
                    emit(1);
                    emit(2);
                });
                var actionB = new core.Action(function (emit) {
                    emit(3);
                    emit(4);
                });
                var x = [];
                actionA
                    .merge(actionB)
                    .run(function (value) {
                        x.push(value);
                    });
                expect(x).to.deep.equal([1, 2, 3, 4]);
            });
        });

        describe("#discard()", function () {
            it("should discard the action and emit undefined only once", function () {
                var action = new core.Action(function (emit) {
                    emit(1);
                    emit(2);
                });
                var x = [];
                action.discard().run(function (value) {
                    x.push(value);
                });
                expect(x).to.deep.equal([undefined]);
            });
        });
    });

    describe("pure(value)", function () {
        it("should create an action which emits the given value only once", function () {
            var flag = false;
            var action = core.pure(true);
            action.run(function (value) {
                expect(flag).to.be.false;
                expect(value).to.be.true;
                flag = true;
            });
        });
    });

    it("should satisfy the functor laws", function () {
        (function () {
            var action = new core.Action(function (emit) {
                emit(1);
                emit(2);
            });
            var id = function (x) { return x; }

            var x = (function () {
                var arr = [];
                core.map(id)(action).run(function (value) {
                    arr.push(value);
                });
                return arr;
            })();

            var y = (function () {
                var arr = [];
                id(action).run(function (value) {
                    arr.push(value);
                });
                return arr;
            })();

            expect(x).to.deep.equal(y);
        })();

        (function () {
            var action = new core.Action(function (emit) {
                emit(1);
                emit(2);
            });
            var f = function (x) { return x + 1; };
            var g = function (x) { return x * 3; };
            var compose = function (g, f) { return function (x) { return g(f(x)); }};

            var x = (function () {
                var arr = [];
                core.map(compose(g, f))(action).run(function (value) {
                    arr.push(value);
                });
                return arr;
            })();

            var y = (function () {
                var arr = [];
                compose(core.map(g), core.map(f))(action).run(function (value) {
                    arr.push(value);
                });
                return arr;
            })();

            expect(x).to.deep.equal(y);
        })();
    });

    it("should satisfy the monad laws", function () {
        (function () {
            var action = core.pure(1);
            var func = function (value) {
                return new core.Action(function (emit) {
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
            var action = new core.Action(function (emit) {
                emit(1);
                emit(2);
            });

            var x = (function () {
                var arr = [];
                action.bind(core.pure).run(function (value) {
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
            var action = new core.Action(function (emit) {
                emit(1);
                emit(2);
            });
            var f = function (value) {
                return new core.Action(function (emit) {
                    emit(value + 1);
                    emit(value + 2);
                });
            };
            var g = function (value) {
                return new core.Action(function (emit) {
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
