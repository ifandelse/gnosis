/**
 * gnosis - A utility to traverse an object and execute a callback to transform the object, etc.
 * Author: Jim Cowart (http://freshbrewedcode.com/jimcowart)
 * Version: v0.1.0
 * Url: https://github.com/ifandelse/gnosis
 * License(s): MIT
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        // Node, or CommonJS-Like environments
        module.exports = function () {
            return factory();
        };
    } else if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return factory(root);
        });
    } else {
        // Browser globals
        root.gnosis = factory(root);
    }
}(this, function (global, undefined) {
    var gExclude = ["_gTree", "rescan"];
    var setValFromPath = function (root, path, val, setFn) {
        var idx = 1;
        var segments = path.split(".");
        var len = segments.length;
        var lastIdx = len - 1;
        var target = root;
        while (idx < len) {
            if (idx !== lastIdx) {
                target = target[segments[idx]];
            } else {
                if (!setFn) {
                    target[segments[idx]] = val;
                } else {
                    setFn(target[segments[idx]], val);
                }
            }
            idx += 1;
        }
    };
    var getKeys = function getKeys(target, options) {
        var keys = [];
        var kind = getType(target);
        if (options.ownProps) {
            keys = Object.keys(target);
        } else {
            for (var prop in target) {
                keys.push(prop);
            }
        }
        if (kind === "array" && options.arrayMembers.length) {
            keys = keys.concat(options.arrayMembers);
        } else if (kind === "object" && options.objectMembers.length) {
            keys = keys.concat(options.objectMembers);
        }
        return keys;
    };

    var getType = function getType(target) {
        var kind = Object.prototype.toString.call(target);
        return kind.substring(8, kind.length - 1).toLowerCase();
    };

    var nodeTypes = {
        "traversable": function traversable(target, key, kind, transformFn, options, path, root) {
            var val = target[key];
            if (!options.rescan || (options.rescan && !root._gTree[path])) {
                transformFn(target, key, val, kind, path, root);
            }
            traverse(val, transformFn, options, path, root);
        },
        "simple": function simple(target, key, kind, transformFn, options, path, root) {
            if (!options.rescan || (options.rescan && !root._gTree[path])) {
                transformFn(target, key, target[key], kind, path, root);
            }
        }
    };

    var traverse = function traverse(target, transformFn, options, path, root) {
        if (arguments.length === 3 && Object.prototype.toString.call(options) === "[object Array]") {
            path = options;
            options = {};
        }
        options = options || {};
        path = path || "{ROOT}";
        options.arrayMembers = options.arrayMembers || traverse.arrayMembers;
        options.objectMembers = options.objectMembers || traverse.objectMembers;
        root = root || target;
        if (!root._gTree) {
            root._gTree = {};
            root._gTree[path] = getType(target);
        }
        if (!root.rescan) {
            root.rescan = function () {
                traverse(target, transformFn, $.extend({}, options, {
                    rescan: true
                }), path, root);
            }
        }
        var keys = getKeys(target, options);
        var idx = 0;
        var member;
        var kind;
        var key;
        var nextPath;
        while (idx < keys.length) {
            key = keys[idx];
            idx += 1;
            if (gExclude.indexOf(key) !== -1) {
                continue;
            }
            member = target[key];
            kind = getType(member);
            nextPath = path + "." + key;
            nodeTypes[kind !== "array" && kind !== "object" ? "simple" : "traversable"](target, key, kind, transformFn, options, nextPath, root);
            root._gTree[nextPath] = kind;
        }
    };
    // defaults for array and object prototype members to include in traversal
    // this can be overridden with the options passed to traverse() for a case-by-case
    // approach, OR they can be set via traverse.arrayMembers (etc) to change defaults
    // for *any* traversals that happen
    traverse.arrayMembers = ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"];
    traverse.objectMembers = [];
    traverse.exclude = gExclude;
    return {
        traverse: traverse,
        getType: getType,
        setValFromPath: setValFromPath
    };
}));