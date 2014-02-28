(function(root, factory) {
    if (typeof module === "object" && module.exports) {
        // Node, or CommonJS-Like environments
        module.exports = function() {
            return factory();
        };
    } else if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function() {
            return factory(root);
        });
    } else {
        // Browser globals
        root.gnosis = factory(root);
    }
}(this, function(global, undefined) {
    var getKeys = function(target, options) {
        var keys = [];
        var kind = getType(target);
        if (options.ownProps) {
            keys = Object.keys(target);
        } else {
            for (var prop in target) {
                keys.push(prop);
            }
        }
        if (kind === "array" && options.arrayProps.length) {
            keys = keys.concat(options.arrayProps);
        } else if (kind === "object" && options.objectProps.length) {
            keys = keys.concat(options.objectProps);
        }
        return keys;
    };

    var getType = function(target) {
        var kind = Object.prototype.toString.call(target);
        return kind.substring(8, kind.length - 1).toLowerCase();
    };

    var nodeTypes = {
        "traversable": function(target, key, kind, transformFn, options, path) {
            var val = target[key];
            transformFn(target, key, val, kind, path);
            traverse(val, transformFn, options, path);
        },
        "simple": function(target, key, kind, transformFn, options, path) {
            transformFn(target, key, target[key], kind, path);
        }
    };

    var traverse = function traverse(target, transformFn, options, path) {
        if (arguments.length === 3 && Object.prototype.toString.call(options) === "[object Array]") {
            path = options;
            options = {};
        }
        options = options || {};
        path = path || ["{ROOT}"];
        options.arrayProps = options.arrayProps || traverse.arrayProps;
        options.objectProps = options.objectProps || traverse.objectProps;
        var keys = getKeys(target, options);
        var idx = 0;
        var member;
        var kind;
        var key;
        while (idx < keys.length) {
            key = keys[idx];
            member = target[key];
            kind = getType(member);
            nodeTypes[kind !== "array" && kind !== "object" ? "simple" : "traversable"](target, key, kind, transformFn, options, path.concat([key]));
            idx += 1;
        }
    };
    // defaults for array and object prototype members to include in traversal
    // this can be overridden with the options passed to traverse() for a case-by-case
    // approach, OR they can be set via traverse.arrayProps (etc) to change defaults
    // for *any* traversals that happen
    traverse.arrayProps = ["push", "pop", "shift", "unshift"];
    traverse.objectProps = [];
    traverse.getType = getType;
    return {
        traverse: traverse
    };
}));