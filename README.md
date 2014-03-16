#Gnosis v0.2.0

##What is it?
Gnosis is a utility to traverse JavaScript objects, allowing you to pass a callback to do something with each member of the object, etc. You can transform the object in place, or do anything else you need.

##API
It's pretty simple. The main method you're concerned with is: `gnosis.traverse(targetObject, transformCallback [,path, options]);`

The `transformCallback` argument is a function with the following signature: 

```javascript
var cb = function(instance, key, val, meta, root) {
  /*
    instance is the object that owns the member we're on
    key is the member name
    val is the current value of target[key]
    meta is an object containing the following:
      {
        source    : OBJECT - The source of the property descriptor. This could
                    be the instance for instance props OR a prototype for things
                    like Array.prototype.push, etc. USE THIS WITH CAUTION!
        name      : STRING - The member name,
        descriptor: OBJECT - Result of calling Object.getOwnPropertyDescriptor(source, name),
        path      : STRING - The dot-notation hierarchy of the path to the member.
                    For example, if you have an array containing address objects, you might
                    see a path like this: {ROOT}.addresses.0.street1. It's possible to use
                    the path to build a full reference to the target field from the root
        level     : INTEGER - The depth in the prototype chain. 0 = instance, 1 first prototype, etc.
        type      : STRING - The result of calling Object.prototype.toString.call(instance[key]);
      }
    root is the top level object that was originally passed to traverse as the target.
  */
}
```

##Example

In the example below, we take a simple object and traverse it, forcing getters and setters on the members, and writing a message to the DOM with information about properties being read or written to (or in the case of `push` on the array, we find out if it was invoked, etc.).

```javascript

var me = {
    name: "Jim",
    city: "Signal Mountain",
    family: ["Stephanie"]
};

gnosis.traverse(
    me,
    function(target, key, val, meta, root) {
        var v = val;
        if (key === "push" && meta.type === "[object Function]" && Object.prototype.toString.call(target) === "[object Array]") {
            target[key] = function() {
                val.apply(target, arguments);
                writeToDom("The value '" + arguments[0] + "' was pushed into the array.");
            };
        } else if (key !== "length") {
            Object.defineProperty(target, key, {
                enumerable: true,
                configurable: true,
                get: function() {
                    var action = meta.type === "[object Function]" ? "invoked" : "read";
                    writeToDom("The '" + key + "' " + meta.type + " was " + action + ".");
                    return v;
                },
                set: function(x) {
                    v = x;
                    writeToDom("The '" + key + "' value was set.");
                }
            });
        }
    },
    "me", {
        nonEnumerable: true,
        walkPrototype: true
    }
);

me.name = "James";
me.city = "Chattanooga";
me.family.push("Ian");

/*
 The following output would be generated:
    The 'family' [object Array] was read.
    The 'name' value was set.
    The 'city' value was set.
    The 'family' [object Array] was read.
    The value 'Ian' was pushed into the array.
*/

```

For a live demo of usage, see [this jsbin](http://jsbin.com/ludew/9/edit?js,output)
