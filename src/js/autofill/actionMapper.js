var autofill = autofill || {};

autofill.actionMapper = (function() {
    var _db = openDatabase("autofill", "", "autofill", 10485760);

    var _execute = function(query, param, callback) {
        _db.transaction(function(tx) {
            tx.executeSql(query, param, function(tx, rs) {
                callback(rs);
            });
        }, function(error) {
            console.log(error)
        });
    };

    var _callable = function(callback, func) {
        if (typeof callback === "function") {
            func();
        }
    };

    var _each = function(rs, callback) {
        for (var i = 0, len = rs.rows.length; i < len; i++) {
            callback(rs.rows.item(i));
        }
    };

    var _findAllByProjectGroupRowIdAndPatternRowId = function(projectGroupRowId, patternRowId, callback) {
        _execute("SELECT rowid, * FROM action WHERE projectGroupRowId = ? AND patternRowId = ?", [
            projectGroupRowId,
            patternRowId
        ], function(rs) {
            _callable(callback, function() {
                var result = [], i = 0, len = rs.rows.length;

                for ( ; i < len; i++) {
                    result.push(rs.rows.item(i));
                }

                callback(result);
            });
        });
    };

    var _findByAction = function(action, callbackFound, callbackNotFound) {
        _execute("SELECT rowid, * FROM action WHERE projectGroupRowId = ? AND patternRowId = ? AND tagName = ? AND attrName = ? LIMIT 1", [
            action.projectGroupRowId,
            action.patternRowId,
            action.tagName,
            action.attrName
        ], function(rs) {
            if (rs.rows.length > 0) {
                _callable(callbackFound, function() {
                    callbackFound(rs.rows.item(0));
                });
            } else {
                _callable(callbackNotFound, function() {
                    callbackNotFound();
                });
            }
        });
    };

    var _insert = function(action, callback) {
        _execute("INSERT INTO action (projectGroupRowId, patternRowId, tagName, attrName, value) VALUES (?, ?, ?, ?, ?)", [
            action.projectGroupRowId,
            action.patternRowId,
            action.tagName,
            action.attrName,
            action.value
        ], function(rs) {
            _callable(callback, function() {
                action.rowid = rs.insertId;
                callback(action);
            });
        });
    };

    var _update = function(action, callback) {
        _execute("UPDATE action SET value = ? WHERE rowid = ?", [
            action.value,
            action.rowid
        ], function(rs) {
            _callable(callback, function() {
                callback(action);
            });
        });
    };

    var _upsert = function(action, callback) {
        _findByAction(
            action,
            function(foundAction) {
                _update(foundAction, function(updatedAction) {
                    _callable(callback, function() {
                        callback(updatedAction);
                    });
                });
            },
            function() {
                _insert(action, function(newAction) {
                    _callable(callback, function() {
                        callback(newAction);
                    });
                });
            }
        );
    };

    return {

        findAllByProjectGroupRowIdAndPatternRowId: function(projectGroupRowId, patternRowId, callback) {
            _findAllByProjectGroupRowIdAndPatternRowId(projectGroupRowId, patternRowId, callback);
        },

        upsert: function(action, callback) {
            _upsert(action, callback);
        }
    };
})();
