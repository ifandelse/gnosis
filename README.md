#Gnosis v0.0.1

##What is it?
Gnosis is a utility to traverse JavaScript objects, allowing you to pass a callback to do something with each member of the object, etc. You can transform the object in place, or do anything else you need.

##API
It's pretty simple, since only one method exists currently: `gnosis.traverse(targetObject, transformCallback);`

The `tranformCallback` argument is a function with the following signature: 

```javascript
var cb = function(target, key, val, kind) {
	// target is the object that owns the member we're on
	// key is the member name
	// val is the current value of target[key]
	// kind is a string value indicating the type (array, object, string, date, regex, number, etc.)
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
  function (target, key, val, kind) {
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
