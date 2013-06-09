var autofill = autofill || {};

autofill.projectMapper = (function() {
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

    var _find = function(rowid, callback) {
        _execute("SELECT rowid, * FROM project WHERE rowid = ?", [rowid], function(row) {
            _callable(callback, function() {
                autofill.projectGroupMapper.find(row.projectGrouprowId, function(projectGroup) {
                    row.projectGroup = projectGroup;
                    callback(row);
                });
            });
        });
    };

    var _findAll = function(callback) {
        _execute("SELECT rowid, * FROM project WHERE active = '1'", [], function(rs) {
            _callable(callback, function() {
                _each(rs, function(row) {
                    autofill.projectGroupMapper.find(row.projectGroupRowId, function(projectGroup) {
                        row.projectGroup = projectGroup;
                        callback(row);
                    });
                });
            });
        });
    };

    var _findByUrl = function(url, callbackFound, callbackNotFound) {
        _execute("SELECT rowid, * FROM project WHERE url = ?", [url], function(rs) {
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

    var _insert = function(project, callback) {
        _findByUrl(project.url, function() {}, function() {
            _execute("INSERT INTO project (projectGroupRowId, url, active) VALUES (?, ?, '1')", [project.projectGroup.rowid, project.url], function(rs) {
                _callable(callback, function() {
                    _findByUrl(project.url, function(project) {
                        callback(project.rowid);
                    });
                });
            });
        });
    };

    return {

        /**
         *
         */
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
         * @param string url
         * @param function callbackFound
         * @param function callbackNotFound
         */
        findByUrl: function(url, callbackFound, callbackNotFound) {
            _findByUrl(url, callbackFound, callbackNotFound);
        },

        /**
         * @param object project
         * @param function callback
         */
        insert: function(project, callback) {
            _insert(project, callback);
        }

    };
})();
