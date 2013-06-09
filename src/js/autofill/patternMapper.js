var autofill = autofill || {};

autofill.patternMapper = (function() {
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

    var _findAll = function(callback) {
        _execute("SELECT rowid, * FROM pattern", [], function(rs) {
            _callable(callback, function() {
                _each(rs, function(row) {
                    callback(row);
                });
            });
        });
    };

    var _findByName = function(name, callbackFound, callbackNotFound) {
        _execute("SELECT rowid, * FROM pattern WHERE name = ? LIMIT 1", [name], function(rs) {
            if (rs.rows.length > 0) {
                callbackFound(rs.rows.item(0));
            } else {
                callbackNotFound();
            }
        });
    };

    var _insert = function(pattern, callback) {
        _findByName(pattern.name, function() {}, function() {
            _execute("INSERT INTO pattern (name) VALUES (?)", [pattern.name], function(rs) {
                _callable(callback, function() {
                    _findByName(pattern.name, function(pattern) {
                        callback(pattern.rowid);
                    });
                });
            });
        });
    };

    return {

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
         * @param object pattern
         * @param function callback
         */
        insert: function(pattern, callback) {
            _insert(pattern, callback);
        }

    };
})();
