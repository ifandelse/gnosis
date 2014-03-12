/**
 * gnosis - A utility to traverse an object and execute a callback to transform the object, etc.
 * Author: Jim Cowart (http://freshbrewedcode.com/jimcowart)
 * Version: v0.2.0
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
    var depthNodes = ["[object Object]", "[object Array]"];
    var exclusion = ["__gnosis__", "__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__", "__proto__", "constructor", "isPrototypeOf", "hasOwnProperty", "propertyIsEnumerable", "valueOf", "toString", "toLocaleString"];

    function setValFromPath(root, path, val, setFn) {
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

    function buildMeta(obj, path, options, level, accum, cb, root, instance) {
        instance = instance || obj;
        if (obj) {
            (options.nonEnumerable ? Object.getOwnPropertyNames(obj) : Object.keys(obj)).forEach(function (key) {
                if (exclusion.indexOf(key) === -1) {
                    var thisPath = path + "." + key;
                    try {
                        var desc = Object.getOwnPropertyDescriptor(obj, key);
                        var type = Object.prototype.toString.call(obj[key]);
                        var meta;
                        if (!accum.hasOwnProperty(thisPath) || accum[thisPath].type !== type) {
                            meta = accum[thisPath] = {
                                source: obj,
                                name: key,
                                descriptor: desc,
                                path: thisPath,
                                level: level,
                                type: type
                            };
                            cb(instance, key, obj[key], meta, root);
                            if (depthNodes.indexOf(type) !== -1) {
                                buildMeta(obj[key], thisPath, options, level, accum, cb, root);
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
        }
        if (obj && options.walkPrototype) {
            buildMeta(Object.getPrototypeOf(obj), path, options, level + 1, accum, cb, root, obj);
        }
    }

    function traverse(obj, cb, path, options, level) {
        path = path || "{ROOT}";
        options = options || {};
        level = level || 0;
        var meta = {};
        buildMeta(obj, path, options, level, meta, cb, obj);
        return meta;
    }

    return {
        depthNodes: depthNodes,
        exclusion: exclusion,
        traverse: traverse,
        setValFromPath: setValFromPath
    };
}));