var autofill = autofill || {};

autofill.projectGroupMapper = (function() {
    var _db = openDatabase("autofill", "", "autofill", 10485760);

    var _execute = function(query, param, callback) {
        _db.transaction(function(tx) {
            tx.executeSql(query, param, function(tx, rs) {
                callback(rs);
            });
        }, function(error) {
            console.log(error);
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

    var _find = function(rowid, callback) {
        _execute("SELECT rowid, * FROM projectGroup WHERE rowid = ?", [rowid], function(rs) {
            _callable(callback, function() {
                callback(rs.rows.item(0));
            });
        });
    };

    var _findAll = function(callback) {
        _execute("SELECT rowid, * FROM projectGroup", [], function(rs) {
            _callable(callback, function() {
                _each(rs, function(row) {
                    callback(row);
                });
            });
        });
    };

    var _findByName = function(name, callbackFound, callbackNotFound) {
        _execute("SELECT rowid, * FROM projectGroup WHERE name = ? LIMIT 1", [name], function(rs) {
            if (rs.rows.length > 0) {
                callbackFound(rs.rows.item(0));
            } else {
                callbackNotFound();
            }
        });
    };

    var _insert = function(projectGroup, callback) {
        _findByName(projectGroup.name, function() {}, function() {
            _execute("INSERT INTO projectGroup (name) VALUES (?)", [projectGroup.name], function(rs) {
                _callable(callback, function() {
                    _findByName(projectGroup.name, function(projectGroup) {
                        callback(projectGroup.rowid);
                    });
                });
            });
        });
    };

    return {

        find: function(rowid, callback) {
            _find(rowid, callback);
        },

        /**
         *
         */
        findAll: function(callback) {
            _findAll(callback);
        },

        /**
         * @param string name
         * @param function callbackFound
         * @param function callbackNotFound
         */
        findByName: function(name, callbackFound, callbackNotFound) {
            _findByName(name, callbackFound, callbackNotFound);
        },

        /**
         * @param object projectGroup
         * @param function callback
         */
        insert: function(projectGroup, callback) {
            _insert(projectGroup, callback);
        }

    };
})();
