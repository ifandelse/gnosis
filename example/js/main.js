function writeToDom(val) {
    var div = document.createElement("div");
    var pre = document.createElement("pre");
    pre.appendChild(document.createTextNode(val));
    div.appendChild(pre);
    document.body.appendChild(div);
}

gnosis.traverse.exclude.push("undo");
gnosis.traverse.exclude.push("undoTo");
gnosis.traverse.exclude.push("_changes");
gnosis.traverse.exclude.push("_undoInProgress");

var setValFromPath = function(root, path, val, setFn) {
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

var punchMutator = function(target, key, val, kind, path, root) {
    var oldMut = target[key];
    target[key] = function() {
        var oldVal = CY.clone(target, {
            allowFunctions: true
        });
        oldMut.apply(target, arguments);
        if (!root._undoInProgress) {
            root._changes.push({
                changeType: "mutation",
                path: path.slice(0, path.length - key.length - 1),
                oldVal: oldVal
            });
        }
        root.rescan();
    };
};

var punchProperty = function(target, key, val, kind, path, root) {
    var _val = val;
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            return _val;
        },
        set: function(x) {
            var oldVal = CY.clone(_val, {
                allowFunctions: true
            });
            var oldType = gnosis.getType(oldVal);
            var newType = gnosis.getType(x);
            _val = x;
            if (!root._undoInProgress) {
                root._changes.push({
                    changeType: "assignment",
                    path: path,
                    oldVal: oldVal
                });
            }
            if (oldType !== newType || newType === "object" || newType === "array") {
                root.rescan();
            }
        }
    });
};

var Undoable = function(target, options, rootNs) {
    $.extend(this, target);
    var transformFn = function(target, key, val, kind, path, root) {
        if (kind === "function" && gnosis.getType(target) === "array" && gnosis.traverse.arrayMembers.indexOf(key) !== -1) {
            punchMutator(target, key, val, kind, path, root);
        } else if (kind !== "function") {
            punchProperty(target, key, val, kind, path, root);
        }
    };
    gnosis.traverse(this, transformFn, options, rootNs);
    this._changes = [];
    this._undoInProgress = false;
};

Undoable.prototype.undo = function(x) {
    var change;
    var setFn;
    this._undoInProgress = true;
    x = x || 1;
    while (x > 0) {
        change = this._changes.pop();
        if (!change) {
            break;
        }
        setFn = change.changeType === "mutation" ? function(target, old) {
            var args = [0, target.length].concat(old);
            Array.prototype.splice.apply(target, args);
        } : undefined;
        setValFromPath(this, change.path, change.oldVal, setFn);
        x -= 1;
    }
    this._undoInProgress = false;
};

Undoable.prototype.undoTo = function(x) {
    var lastIdx = this._changes.length - 1;
    if (x > lastIdx) {
        throw new Error("The change history only goes up to index " + lastIdx + " but you wanted to undo to index " + x + ".");
    }
    // we add 1 because the range is inclusive
    this.undo(lastIdx - x + 1);
};

var me = {
    name: "Jim",
    city: "Nashville",
    family: ["Steph"]
};

var undoableMe = new Undoable(me, {}, "me");

undoableMe.name = "James";
undoableMe.family.splice(1, 0, "James", "Nate");
undoableMe.city = "Chattanooga";
undoableMe.family.push("Amelia");
undoableMe.undo();
undoableMe.family.push("Ian");

writeToDom(JSON.stringify(undoableMe, null, 2));