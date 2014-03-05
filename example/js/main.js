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
    function(target, key, val, kind, path, root) {
        var v = val;
        if (key === "push" && kind === "function" && gnosis.getType(target) === "array") {
            target[key] = function() {
                val.apply(target, arguments);
                writeToDom("The value '" + arguments[0] + "' was pushed into the array.", "*");
            };
        } else {
            Object.defineProperty(target, key, {
                enumerable: true,
                configurable: true,
                get: function() {
                    var action = kind === "function" ? "invoked" : "read";
                    writeToDom("The '" + key + "' " + kind + " was " + action + ".", "*");
                    return v;
                },
                set: function(x) {
                    v = x;
                    writeToDom("The '" + key + "' value was set.", "*");
                }
            });
        }
    }
);

me.name = "James";
me.city = "Chattanooga";
me.family.push("Ian");

/*
 The following output will be generated:
    The 'name' value was set.
    The 'city' value was set.
    The 'family' array was read.
    The value 'Ian' was pushed into the array.
*/