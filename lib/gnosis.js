/**
 * gnosis - A utility to traverse an object and execute a callback to transform the object, etc.
 * Author: Jim Cowart (http://freshbrewedcode.com/jimcowart)
 * Version: v0.0.2
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
    var getKeys = function (target, options) {
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

    var getType = function (target) {
        var kind = Object.prototype.toString.call(target);
        return kind.substring(8, kind.length - 1).toLowerCase();
    };

    var nodeTypes = {
        "traversable": function (target, key, kind, transformFn, options, path, root) {
            var val = target[key];
            transformFn(target, key, val, kind, path, root);
            traverse(val, transformFn, options, path, root);
        },
        "simple": function (target, key, kind, transformFn, options, path, root) {
            transformFn(target, key, target[key], kind, path, root);
        }
    };

    var traverse = function traverse(target, transformFn, options, path, root) {
        if (arguments.length === 3 && Object.prototype.toString.call(options) === "[object Array]") {
            path = options;
            options = {};
        }
        options = options || {};
        path = path || ["{ROOT}"];
        options.arrayMembers = options.arrayMembers || traverse.arrayMembers;
        options.objectMembers = options.objectMembers || traverse.objectMembers;
        root = root || target;
        var keys = getKeys(target, options);
        var idx = 0;
        var member;
        var kind;
        var key;
        while (idx < keys.length) {
            key = keys[idx];
            member = target[key];
            kind = getType(member);
            nodeTypes[kind !== "array" && kind !== "object" ? "simple" : "traversable"](target, key, kind, transformFn, options, path.concat([key]), root);
            idx += 1;
        }
    };
    // defaults for array and object prototype members to include in traversal
    // this can be overridden with the options passed to traverse() for a case-by-case
    // approach, OR they can be set via traverse.arrayMembers (etc) to change defaults
    // for *any* traversals that happen
    traverse.arrayMembers = ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"];
    traverse.objectMembers = [];
    traverse.getType = getType;
    return {
        traverse: traverse,
        getType: getType
    };
}));