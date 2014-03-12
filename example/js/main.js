function writeToDom(val) {
    var div = document.createElement("div");
    var pre = document.createElement("pre");
    pre.appendChild(document.createTextNode(val));
    div.appendChild(pre);
    document.body.appendChild(div);
}

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
 The following output will be generated:
    The 'family' [object Array] was read.
    The 'name' value was set.
    The 'city' value was set.
    The 'family' [object Array] was read.
    The value 'Ian' was pushed into the array.
*/