/*global describe, it, after, before, expect */
(function() {
    var gnosis = typeof window === "undefined" ? require("../lib/gnosis.js") : window.gnosis;
    var expect = typeof window === "undefined" ? require("expect.js") : window.expect;
    describe("gnosis", function() {
        describe("When traversing a simple object", function() {
            var simple;
            before(function() {
                simple = {
                    name: "Marty",
                    year: 1985,
                    skateboard: true
                };
                Object.defineProperty(simple, "car", {
                    enumerable: false,
                    value: "Delorean"
                });
            });
            describe("And only traversing own enumerable props", function() {
                var result = {};
                before(function() {
                    gnosis.traverse(simple, function(target, key, val, meta, root) {
                        result[meta.path] = {
                            target: target,
                            key: key,
                            val: val,
                            meta: meta,
                            root: root
                        }
                    }, "simple");
                });
                it("Should have traversed the name prop", function() {
                    expect(result["simple.name"].val).to.be("Marty");
                    expect(result["simple.name"].key).to.be("name");
                    expect(result["simple.name"].target).to.be(simple);
                    expect(result["simple.name"].root).to.be(simple);
                    expect(result["simple.name"].meta.level).to.be(0);
                    expect(result["simple.name"].meta.path).to.be("simple.name");
                    expect(result["simple.name"].meta.type).to.be("[object String]");
                    expect(result["simple.name"].meta.source).to.be(simple);
                    expect(result["simple.name"].meta.descriptor.configurable).to.be(true);
                    expect(result["simple.name"].meta.descriptor.enumerable).to.be(true);
                    expect(result["simple.name"].meta.descriptor.value).to.be("Marty");
                    expect(result["simple.name"].meta.descriptor.writable).to.be(true);
                });
                it("Should have traversed the year prop", function() {
                    expect(result["simple.year"].val).to.be(1985);
                    expect(result["simple.year"].key).to.be("year");
                    expect(result["simple.year"].target).to.be(simple);
                    expect(result["simple.year"].root).to.be(simple);
                    expect(result["simple.year"].meta.level).to.be(0);
                    expect(result["simple.year"].meta.path).to.be("simple.year");
                    expect(result["simple.year"].meta.type).to.be("[object Number]");
                    expect(result["simple.year"].meta.source).to.be(simple);
                    expect(result["simple.year"].meta.descriptor.configurable).to.be(true);
                    expect(result["simple.year"].meta.descriptor.enumerable).to.be(true);
                    expect(result["simple.year"].meta.descriptor.value).to.be(1985);
                    expect(result["simple.year"].meta.descriptor.writable).to.be(true);
                });
                it("Should have traversed the skateboard prop", function() {
                    expect(result["simple.skateboard"].val).to.be(true);
                    expect(result["simple.skateboard"].key).to.be("skateboard");
                    expect(result["simple.skateboard"].target).to.be(simple);
                    expect(result["simple.skateboard"].root).to.be(simple);
                    expect(result["simple.skateboard"].meta.level).to.be(0);
                    expect(result["simple.skateboard"].meta.path).to.be("simple.skateboard");
                    expect(result["simple.skateboard"].meta.type).to.be("[object Boolean]");
                    expect(result["simple.skateboard"].meta.source).to.be(simple);
                    expect(result["simple.skateboard"].meta.descriptor.configurable).to.be(true);
                    expect(result["simple.skateboard"].meta.descriptor.enumerable).to.be(true);
                    expect(result["simple.skateboard"].meta.descriptor.value).to.be(true);
                    expect(result["simple.skateboard"].meta.descriptor.writable).to.be(true);
                });
                it("Should NOT have traversed the car prop", function() {
                    expect(result.hasOwnProperty("simple.car")).to.be(false);
                });
            });
            describe("And traversing all own props", function() {
                var result = {};
                before(function() {
                    gnosis.traverse(simple, function(target, key, val, meta, root) {
                        result[meta.path] = {
                            target: target,
                            key: key,
                            val: val,
                            meta: meta,
                            root: root
                        }
                    }, "simple", {
                        nonEnumerable: true
                    });
                });
                it("Should have traversed the name prop", function() {
                    expect(result["simple.name"].val).to.be("Marty");
                    expect(result["simple.name"].key).to.be("name");
                    expect(result["simple.name"].target).to.be(simple);
                    expect(result["simple.name"].root).to.be(simple);
                    expect(result["simple.name"].meta.level).to.be(0);
                    expect(result["simple.name"].meta.path).to.be("simple.name");
                    expect(result["simple.name"].meta.type).to.be("[object String]");
                    expect(result["simple.name"].meta.source).to.be(simple);
                    expect(result["simple.name"].meta.descriptor.configurable).to.be(true);
                    expect(result["simple.name"].meta.descriptor.enumerable).to.be(true);
                    expect(result["simple.name"].meta.descriptor.value).to.be("Marty");
                    expect(result["simple.name"].meta.descriptor.writable).to.be(true);
                });
                it("Should have traversed the year prop", function() {
                    expect(result["simple.year"].val).to.be(1985);
                    expect(result["simple.year"].key).to.be("year");
                    expect(result["simple.year"].target).to.be(simple);
                    expect(result["simple.year"].root).to.be(simple);
                    expect(result["simple.year"].meta.level).to.be(0);
                    expect(result["simple.year"].meta.path).to.be("simple.year");
                    expect(result["simple.year"].meta.type).to.be("[object Number]");
                    expect(result["simple.year"].meta.source).to.be(simple);
                    expect(result["simple.year"].meta.descriptor.configurable).to.be(true);
                    expect(result["simple.year"].meta.descriptor.enumerable).to.be(true);
                    expect(result["simple.year"].meta.descriptor.value).to.be(1985);
                    expect(result["simple.year"].meta.descriptor.writable).to.be(true);
                });
                it("Should have traversed the skateboard prop", function() {
                    expect(result["simple.skateboard"].val).to.be(true);
                    expect(result["simple.skateboard"].key).to.be("skateboard");
                    expect(result["simple.skateboard"].target).to.be(simple);
                    expect(result["simple.skateboard"].root).to.be(simple);
                    expect(result["simple.skateboard"].meta.level).to.be(0);
                    expect(result["simple.skateboard"].meta.path).to.be("simple.skateboard");
                    expect(result["simple.skateboard"].meta.type).to.be("[object Boolean]");
                    expect(result["simple.skateboard"].meta.source).to.be(simple);
                    expect(result["simple.skateboard"].meta.descriptor.configurable).to.be(true);
                    expect(result["simple.skateboard"].meta.descriptor.enumerable).to.be(true);
                    expect(result["simple.skateboard"].meta.descriptor.value).to.be(true);
                    expect(result["simple.skateboard"].meta.descriptor.writable).to.be(true);
                });
                it("Should have traversed the car prop", function() {
                    expect(result["simple.car"].val).to.be("Delorean");
                    expect(result["simple.car"].key).to.be("car");
                    expect(result["simple.car"].target).to.be(simple);
                    expect(result["simple.car"].root).to.be(simple);
                    expect(result["simple.car"].meta.level).to.be(0);
                    expect(result["simple.car"].meta.path).to.be("simple.car");
                    expect(result["simple.car"].meta.type).to.be("[object String]");
                    expect(result["simple.car"].meta.source).to.be(simple);
                    expect(result["simple.car"].meta.descriptor.configurable).to.be(false);
                    expect(result["simple.car"].meta.descriptor.enumerable).to.be(false);
                    expect(result["simple.car"].meta.descriptor.value).to.be("Delorean");
                    expect(result["simple.car"].meta.descriptor.writable).to.be(false);
                });
            });
        });
        describe("When traversing the instance and prototype", function() {
            function TimeTraveler() {}
            TimeTraveler.prototype.travelTo = function(year) {
                return this.name + " traveled to " + year + ".";
            }
            var instance;
            before(function() {
                instance = Object.create(TimeTraveler.prototype, {
                    name: {
                        configurable: true,
                        writable: true,
                        enumerable: true,
                        value: "Marty"
                    },
                    car: {
                        enumerable: false,
                        value: "Delorean"
                    }
                });
            });
            describe("And only traversing enumerable props", function() {
                var result = {};
                before(function() {
                    gnosis.traverse(instance, function(target, key, val, meta, root) {
                        result[meta.path] = {
                            target: target,
                            key: key,
                            val: val,
                            meta: meta,
                            root: root
                        }
                    }, "instance", {
                        walkPrototype: true
                    });
                });
                it("Should have traversed the name prop", function() {
                    expect(result["instance.name"].val).to.be("Marty");
                    expect(result["instance.name"].key).to.be("name");
                    expect(result["instance.name"].target).to.be(instance);
                    expect(result["instance.name"].root).to.be(instance);
                    expect(result["instance.name"].meta.level).to.be(0);
                    expect(result["instance.name"].meta.path).to.be("instance.name");
                    expect(result["instance.name"].meta.type).to.be("[object String]");
                    expect(result["instance.name"].meta.source).to.be(instance);
                    expect(result["instance.name"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.name"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.name"].meta.descriptor.value).to.be("Marty");
                    expect(result["instance.name"].meta.descriptor.writable).to.be(true);
                });
                it("Should have traversed the travelTo prop", function() {
                    expect(result["instance.travelTo"].val).to.be(TimeTraveler.prototype.travelTo);
                    expect(result["instance.travelTo"].key).to.be("travelTo");
                    expect(result["instance.travelTo"].target).to.be(instance);
                    expect(result["instance.travelTo"].root).to.be(instance);
                    expect(result["instance.travelTo"].meta.level).to.be(1);
                    expect(result["instance.travelTo"].meta.path).to.be("instance.travelTo");
                    expect(result["instance.travelTo"].meta.type).to.be("[object Function]");
                    expect(result["instance.travelTo"].meta.source).to.be(TimeTraveler.prototype);
                    expect(result["instance.travelTo"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.travelTo"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.travelTo"].meta.descriptor.value).to.be(TimeTraveler.prototype.travelTo);
                    expect(result["instance.travelTo"].meta.descriptor.writable).to.be(true);
                });
                it("Should NOT have traversed the car prop", function() {
                    expect(result.hasOwnProperty("instance.car")).to.be(false);
                });
            });
            describe("And traversing all props", function() {
                var result = {};
                before(function() {
                    gnosis.traverse(instance, function(target, key, val, meta, root) {
                        result[meta.path] = {
                            target: target,
                            key: key,
                            val: val,
                            meta: meta,
                            root: root
                        }
                    }, "instance", {
                        walkPrototype: true,
                        nonEnumerable: true
                    });
                });
                it("Should have traversed the name prop", function() {
                    expect(result["instance.name"].val).to.be("Marty");
                    expect(result["instance.name"].key).to.be("name");
                    expect(result["instance.name"].target).to.be(instance);
                    expect(result["instance.name"].root).to.be(instance);
                    expect(result["instance.name"].meta.level).to.be(0);
                    expect(result["instance.name"].meta.path).to.be("instance.name");
                    expect(result["instance.name"].meta.type).to.be("[object String]");
                    expect(result["instance.name"].meta.source).to.be(instance);
                    expect(result["instance.name"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.name"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.name"].meta.descriptor.value).to.be("Marty");
                    expect(result["instance.name"].meta.descriptor.writable).to.be(true);
                });
                it("Should have traversed the travelTo prop", function() {
                    expect(result["instance.travelTo"].val).to.be(TimeTraveler.prototype.travelTo);
                    expect(result["instance.travelTo"].key).to.be("travelTo");
                    expect(result["instance.travelTo"].target).to.be(instance);
                    expect(result["instance.travelTo"].root).to.be(instance);
                    expect(result["instance.travelTo"].meta.level).to.be(1);
                    expect(result["instance.travelTo"].meta.path).to.be("instance.travelTo");
                    expect(result["instance.travelTo"].meta.type).to.be("[object Function]");
                    expect(result["instance.travelTo"].meta.source).to.be(TimeTraveler.prototype);
                    expect(result["instance.travelTo"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.travelTo"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.travelTo"].meta.descriptor.value).to.be(TimeTraveler.prototype.travelTo);
                    expect(result["instance.travelTo"].meta.descriptor.writable).to.be(true);
                });
                it("Should have traversed the car prop", function() {
                    expect(result["instance.car"].val).to.be("Delorean");
                    expect(result["instance.car"].key).to.be("car");
                    expect(result["instance.car"].target).to.be(instance);
                    expect(result["instance.car"].root).to.be(instance);
                    expect(result["instance.car"].meta.level).to.be(0);
                    expect(result["instance.car"].meta.path).to.be("instance.car");
                    expect(result["instance.car"].meta.type).to.be("[object String]");
                    expect(result["instance.car"].meta.source).to.be(instance);
                    expect(result["instance.car"].meta.descriptor.configurable).to.be(false);
                    expect(result["instance.car"].meta.descriptor.enumerable).to.be(false);
                    expect(result["instance.car"].meta.descriptor.value).to.be("Delorean");
                    expect(result["instance.car"].meta.descriptor.writable).to.be(false);
                });
            });
        });
        describe("When traversing an object with depth nodes", function() {
            var instance;
            before(function() {
                instance = {
                    name: "Doc Brown",
                    years: [1885, 1955, 1985],
                    spouse: {
                        name: "Clara Clayton"
                    }
                };
            });
            describe("And only traversing own props", function() {
                var result = {};
                before(function() {
                    gnosis.traverse(instance, function(target, key, val, meta, root) {
                        result[meta.path] = {
                            target: target,
                            key: key,
                            val: val,
                            meta: meta,
                            root: root
                        }
                    }, "instance");
                });
                it("Should have traversed the name prop", function() {
                    expect(result["instance.name"].val).to.be("Doc Brown");
                    expect(result["instance.name"].key).to.be("name");
                    expect(result["instance.name"].target).to.be(instance);
                    expect(result["instance.name"].root).to.be(instance);
                    expect(result["instance.name"].meta.level).to.be(0);
                    expect(result["instance.name"].meta.path).to.be("instance.name");
                    expect(result["instance.name"].meta.type).to.be("[object String]");
                    expect(result["instance.name"].meta.source).to.be(instance);
                    expect(result["instance.name"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.name"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.name"].meta.descriptor.value).to.be("Doc Brown");
                    expect(result["instance.name"].meta.descriptor.writable).to.be(true);
                });
                it("Should have traversed the years prop", function() {
                    expect(result["instance.years"].val).to.be(instance.years);
                    expect(result["instance.years"].key).to.be("years");
                    expect(result["instance.years"].target).to.be(instance);
                    expect(result["instance.years"].root).to.be(instance);
                    expect(result["instance.years"].meta.level).to.be(0);
                    expect(result["instance.years"].meta.path).to.be("instance.years");
                    expect(result["instance.years"].meta.type).to.be("[object Array]");
                    expect(result["instance.years"].meta.source).to.be(instance);
                    expect(result["instance.years"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.years"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.years"].meta.descriptor.value).to.be(instance.years);
                    expect(result["instance.years"].meta.descriptor.writable).to.be(true);

                    expect(result["instance.years.0"].val).to.be(1885);
                    expect(result["instance.years.0"].key).to.be("0");
                    expect(result["instance.years.0"].target).to.be(instance.years);
                    expect(result["instance.years.0"].root).to.be(instance);
                    expect(result["instance.years.0"].meta.level).to.be(0);
                    expect(result["instance.years.0"].meta.path).to.be("instance.years.0");
                    expect(result["instance.years.0"].meta.type).to.be("[object Number]");
                    expect(result["instance.years.0"].meta.source).to.be(instance.years);
                    expect(result["instance.years.0"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.years.0"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.years.0"].meta.descriptor.value).to.be(1885);
                    expect(result["instance.years.0"].meta.descriptor.writable).to.be(true);

                    expect(result["instance.years.1"].val).to.be(1955);
                    expect(result["instance.years.1"].key).to.be("1");
                    expect(result["instance.years.1"].target).to.be(instance.years);
                    expect(result["instance.years.1"].root).to.be(instance);
                    expect(result["instance.years.1"].meta.level).to.be(0);
                    expect(result["instance.years.1"].meta.path).to.be("instance.years.1");
                    expect(result["instance.years.1"].meta.type).to.be("[object Number]");
                    expect(result["instance.years.1"].meta.source).to.be(instance.years);
                    expect(result["instance.years.1"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.years.1"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.years.1"].meta.descriptor.value).to.be(1955);
                    expect(result["instance.years.1"].meta.descriptor.writable).to.be(true);

                    expect(result["instance.years.2"].val).to.be(1985);
                    expect(result["instance.years.2"].key).to.be("2");
                    expect(result["instance.years.2"].target).to.be(instance.years);
                    expect(result["instance.years.2"].root).to.be(instance);
                    expect(result["instance.years.2"].meta.level).to.be(0);
                    expect(result["instance.years.2"].meta.path).to.be("instance.years.2");
                    expect(result["instance.years.2"].meta.type).to.be("[object Number]");
                    expect(result["instance.years.2"].meta.source).to.be(instance.years);
                    expect(result["instance.years.2"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.years.2"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.years.2"].meta.descriptor.value).to.be(1985);
                    expect(result["instance.years.2"].meta.descriptor.writable).to.be(true);
                });
                it("Should have traversed the spouse prop", function() {
                    expect(result["instance.spouse"].val).to.be(instance.spouse);
                    expect(result["instance.spouse"].key).to.be("spouse");
                    expect(result["instance.spouse"].target).to.be(instance);
                    expect(result["instance.spouse"].root).to.be(instance);
                    expect(result["instance.spouse"].meta.level).to.be(0);
                    expect(result["instance.spouse"].meta.path).to.be("instance.spouse");
                    expect(result["instance.spouse"].meta.type).to.be("[object Object]");
                    expect(result["instance.spouse"].meta.source).to.be(instance);
                    expect(result["instance.spouse"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.spouse"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.spouse"].meta.descriptor.value).to.be(instance.spouse);
                    expect(result["instance.spouse"].meta.descriptor.writable).to.be(true);

                    expect(result["instance.spouse.name"].val).to.be("Clara Clayton");
                    expect(result["instance.spouse.name"].key).to.be("name");
                    expect(result["instance.spouse.name"].target).to.be(instance.spouse);
                    expect(result["instance.spouse.name"].root).to.be(instance);
                    expect(result["instance.spouse.name"].meta.level).to.be(0);
                    expect(result["instance.spouse.name"].meta.path).to.be("instance.spouse.name");
                    expect(result["instance.spouse.name"].meta.type).to.be("[object String]");
                    expect(result["instance.spouse.name"].meta.source).to.be(instance.spouse);
                    expect(result["instance.spouse.name"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.spouse.name"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.spouse.name"].meta.descriptor.value).to.be("Clara Clayton");
                    expect(result["instance.spouse.name"].meta.descriptor.writable).to.be(true);
                });
            });
            describe("And traversing all props", function() {
                var result = {};
                before(function() {
                    gnosis.traverse(instance, function(target, key, val, meta, root) {
                        result[meta.path] = {
                            target: target,
                            key: key,
                            val: val,
                            meta: meta,
                            root: root
                        }
                    }, "instance", {
                        walkPrototype: true,
                        nonEnumerable: true
                    });
                });
                it("Should have traversed the name prop", function() {
                    expect(result["instance.name"].val).to.be("Doc Brown");
                    expect(result["instance.name"].key).to.be("name");
                    expect(result["instance.name"].target).to.be(instance);
                    expect(result["instance.name"].root).to.be(instance);
                    expect(result["instance.name"].meta.level).to.be(0);
                    expect(result["instance.name"].meta.path).to.be("instance.name");
                    expect(result["instance.name"].meta.type).to.be("[object String]");
                    expect(result["instance.name"].meta.source).to.be(instance);
                    expect(result["instance.name"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.name"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.name"].meta.descriptor.value).to.be("Doc Brown");
                    expect(result["instance.name"].meta.descriptor.writable).to.be(true);
                });
                it("Should have traversed the years prop", function() {
                    expect(result["instance.years"].val).to.be(instance.years);
                    expect(result["instance.years"].key).to.be("years");
                    expect(result["instance.years"].target).to.be(instance);
                    expect(result["instance.years"].root).to.be(instance);
                    expect(result["instance.years"].meta.level).to.be(0);
                    expect(result["instance.years"].meta.path).to.be("instance.years");
                    expect(result["instance.years"].meta.type).to.be("[object Array]");
                    expect(result["instance.years"].meta.source).to.be(instance);
                    expect(result["instance.years"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.years"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.years"].meta.descriptor.value).to.be(instance.years);
                    expect(result["instance.years"].meta.descriptor.writable).to.be(true);

                    expect(result["instance.years.0"].val).to.be(1885);
                    expect(result["instance.years.0"].key).to.be("0");
                    expect(result["instance.years.0"].target).to.be(instance.years);
                    expect(result["instance.years.0"].root).to.be(instance);
                    expect(result["instance.years.0"].meta.level).to.be(0);
                    expect(result["instance.years.0"].meta.path).to.be("instance.years.0");
                    expect(result["instance.years.0"].meta.type).to.be("[object Number]");
                    expect(result["instance.years.0"].meta.source).to.be(instance.years);
                    expect(result["instance.years.0"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.years.0"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.years.0"].meta.descriptor.value).to.be(1885);
                    expect(result["instance.years.0"].meta.descriptor.writable).to.be(true);

                    expect(result["instance.years.1"].val).to.be(1955);
                    expect(result["instance.years.1"].key).to.be("1");
                    expect(result["instance.years.1"].target).to.be(instance.years);
                    expect(result["instance.years.1"].root).to.be(instance);
                    expect(result["instance.years.1"].meta.level).to.be(0);
                    expect(result["instance.years.1"].meta.path).to.be("instance.years.1");
                    expect(result["instance.years.1"].meta.type).to.be("[object Number]");
                    expect(result["instance.years.1"].meta.source).to.be(instance.years);
                    expect(result["instance.years.1"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.years.1"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.years.1"].meta.descriptor.value).to.be(1955);
                    expect(result["instance.years.1"].meta.descriptor.writable).to.be(true);

                    expect(result["instance.years.2"].val).to.be(1985);
                    expect(result["instance.years.2"].key).to.be("2");
                    expect(result["instance.years.2"].target).to.be(instance.years);
                    expect(result["instance.years.2"].root).to.be(instance);
                    expect(result["instance.years.2"].meta.level).to.be(0);
                    expect(result["instance.years.2"].meta.path).to.be("instance.years.2");
                    expect(result["instance.years.2"].meta.type).to.be("[object Number]");
                    expect(result["instance.years.2"].meta.source).to.be(instance.years);
                    expect(result["instance.years.2"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.years.2"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.years.2"].meta.descriptor.value).to.be(1985);
                    expect(result["instance.years.2"].meta.descriptor.writable).to.be(true);
                });
                it("Should have traversed Array.prototype", function() {
                    Object.getOwnPropertyNames(Array.prototype).forEach(function(key) {
                        if (["length", "constructor", "toString", "toLocaleString"].indexOf(key) === -1) {
                            expect(result["instance.years." + key].val).to.be(Array.prototype[key]);
                            expect(result["instance.years." + key].key).to.be(key);
                            expect(result["instance.years." + key].target).to.be(instance.years);
                            expect(result["instance.years." + key].root).to.be(instance);
                            expect(result["instance.years." + key].meta.level).to.be(1);
                            expect(result["instance.years." + key].meta.path).to.be("instance.years." + key);
                            expect(result["instance.years." + key].meta.type).to.be("[object Function]");
                            expect(result["instance.years." + key].meta.source).to.be(Array.prototype);
                            expect(result["instance.years." + key].meta.descriptor.value).to.be(Array.prototype[key]);
                        }
                    });
                });
                it("Should have traversed the spouse prop", function() {
                    expect(result["instance.spouse"].val).to.be(instance.spouse);
                    expect(result["instance.spouse"].key).to.be("spouse");
                    expect(result["instance.spouse"].target).to.be(instance);
                    expect(result["instance.spouse"].root).to.be(instance);
                    expect(result["instance.spouse"].meta.level).to.be(0);
                    expect(result["instance.spouse"].meta.path).to.be("instance.spouse");
                    expect(result["instance.spouse"].meta.type).to.be("[object Object]");
                    expect(result["instance.spouse"].meta.source).to.be(instance);
                    expect(result["instance.spouse"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.spouse"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.spouse"].meta.descriptor.value).to.be(instance.spouse);
                    expect(result["instance.spouse"].meta.descriptor.writable).to.be(true);

                    expect(result["instance.spouse.name"].val).to.be("Clara Clayton");
                    expect(result["instance.spouse.name"].key).to.be("name");
                    expect(result["instance.spouse.name"].target).to.be(instance.spouse);
                    expect(result["instance.spouse.name"].root).to.be(instance);
                    expect(result["instance.spouse.name"].meta.level).to.be(0);
                    expect(result["instance.spouse.name"].meta.path).to.be("instance.spouse.name");
                    expect(result["instance.spouse.name"].meta.type).to.be("[object String]");
                    expect(result["instance.spouse.name"].meta.source).to.be(instance.spouse);
                    expect(result["instance.spouse.name"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.spouse.name"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.spouse.name"].meta.descriptor.value).to.be("Clara Clayton");
                    expect(result["instance.spouse.name"].meta.descriptor.writable).to.be(true);
                });
            });
        });
        describe("When performing a diff traversal", function() {
            var instance;
            var result = {};
            before(function() {
                instance = {
                    name: "Marty",
                    year: 1985,
                    skateboard: true
                };
                gnosis.traverse(instance, function(target, key, val, meta, root) {
                    result[meta.path] = {
                        target: target,
                        key: key,
                        val: val,
                        meta: meta,
                        root: root
                    }
                }, "instance", {
                    trackState: true
                });
                console.log(instance);
            });
            describe("When adding new properties", function() {
                it("Should traverse newly added props on a diff traversal", function() {
                    expect(result["instance.name"].val).to.be("Marty");
                    expect(result["instance.year"].val).to.be(1985);
                    expect(result["instance.skateboard"].val).to.be(true);
                    expect(result.hasOwnProperty("instance.lastName")).to.be(false);
                    instance.lastName = "McFly";
                    gnosis.traverseDiff(instance);
                    expect(result["instance.lastName"].val).to.be("McFly");
                    expect(result["instance.lastName"].key).to.be("lastName");
                    expect(result["instance.lastName"].target).to.be(instance);
                    expect(result["instance.lastName"].root).to.be(instance);
                    expect(result["instance.lastName"].meta.level).to.be(0);
                    expect(result["instance.lastName"].meta.path).to.be("instance.lastName");
                    expect(result["instance.lastName"].meta.type).to.be("[object String]");
                    expect(result["instance.lastName"].meta.source).to.be(instance);
                    expect(result["instance.lastName"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.lastName"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.lastName"].meta.descriptor.value).to.be("McFly");
                    expect(result["instance.lastName"].meta.descriptor.writable).to.be(true);
                });
            });
            describe("When changing an existing property type", function() {
                it("Should traverse props with changed types on a diff traversal", function() {
                    expect(result["instance.year"].val).to.be(1985);
                    expect(result["instance.year"].key).to.be("year");
                    expect(result["instance.year"].target).to.be(instance);
                    expect(result["instance.year"].root).to.be(instance);
                    expect(result["instance.year"].meta.level).to.be(0);
                    expect(result["instance.year"].meta.path).to.be("instance.year");
                    expect(result["instance.year"].meta.type).to.be("[object Number]");
                    expect(result["instance.year"].meta.source).to.be(instance);
                    expect(result["instance.year"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.year"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.year"].meta.descriptor.value).to.be(1985);
                    expect(result["instance.year"].meta.descriptor.writable).to.be(true);
                    instance.year = "1985";
                    gnosis.traverseDiff(instance);
                    expect(result["instance.year"].val).to.be("1985");
                    expect(result["instance.year"].key).to.be("year");
                    expect(result["instance.year"].target).to.be(instance);
                    expect(result["instance.year"].root).to.be(instance);
                    expect(result["instance.year"].meta.level).to.be(0);
                    expect(result["instance.year"].meta.path).to.be("instance.year");
                    expect(result["instance.year"].meta.type).to.be("[object String]");
                    expect(result["instance.year"].meta.source).to.be(instance);
                    expect(result["instance.year"].meta.descriptor.configurable).to.be(true);
                    expect(result["instance.year"].meta.descriptor.enumerable).to.be(true);
                    expect(result["instance.year"].meta.descriptor.value).to.be("1985");
                    expect(result["instance.year"].meta.descriptor.writable).to.be(true);
                });
            });
        });
    });
}());