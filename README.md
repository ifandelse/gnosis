#Gnosis v0.0.2

##What is it?
Gnosis is a utility to traverse JavaScript objects, allowing you to pass a callback to do something with each member of the object, etc. You can transform the object in place, or do anything else you need.

##API
It's pretty simple, since only one method exists currently: `gnosis.traverse(targetObject, transformCallback);`

The `transformCallback` argument is a function with the following signature: 

```javascript
var cb = function(target, key, val, kind, path, root) {
  // target is the object that owns the member we're on
  // key is the member name
  // val is the current value of target[key]
  // kind is a string value indicating the type (array, object, string, date, regex, number, etc.)
  // path is an array tracing the keys from the {ROOT} (which is the first element in the array) down the object hierarchy.
  //      For example, if you have an array containing address objects, you might see a path like this:
  //      [{ROOT}, "addresses", "0", "street1"]
  //      it should be possible to use the keys from index 1+ in the paths array to build a full reference to the target field
  // root is the top level object that was originally passed to traverse as the target.
}
```

##Example

In the example below, we take a simple object and traverse it, forcing getters and setters on the members, and posting a message to the window with information about properties being read or written to (or in the case of `push` on the array, we find out if it was invoked, etc.).

```javascript

var me = {
  name: "Jim",
  city: "Signal Mountain",
  family: ["Stephanie"]
};

gnosis.traverse(
  me,
  function (target, key, val, kind, path, root) {
    var v = val;
    if(key === "push" && kind === "function" && traverse.getType(target) === "array") {
      target[key] = function() {
        val.apply(target, arguments);
        window.postMessage("The value '" + arguments[0] + "' was pushed into the array.", "*");
      };
    } else {
      Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get: function () {
          var action = kind === "function" ? "invoked" : "read";
          window.postMessage("The '" + key + "' " + kind + " was " + action + ".", "*");
          return v;
        },
        set: function (x) {
          v = x;
          window.postMessage("The '" + key + "' value was set.", "*");
        }
      });
    }
  }
);

me.name = "James";
me.city = "Chattanooga";
me.family.push("Ian");

/*
 The following output would be generated:
	The 'name' value was set.
	The 'city' value was set.
	The 'family' array was read.
	The value 'Ian' was pushed into the array.
*/

```

For a live demo of usage, see [this jsbin](http://jsbin.com/ludew/3/edit?js,output)
