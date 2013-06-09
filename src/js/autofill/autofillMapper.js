var autofill = autofill || {};

autofill.autofillMapper = (function() {
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

    var _findByUrlPatternQuery = "SELECT " +
                                 "  prj.rowid AS prjRowId, prj.projectGroupRowId AS prjgrpRowId, prj.url AS prjUrl, " +
                                 "  pt.rowid AS ptRowId, pt.name AS ptName " +
                                 "FROM project AS prj, pattern AS pt ";

    var _findByUrlPattern = function(urlPattern, callback) {
        _execute(_findByUrlPatternQuery, [], function(rs) {
            var result = null, i = 0, len = rs.rows.length, row;

            for ( ; i < len; i++) {
                row = rs.rows.item(i);
                if (urlPattern === row.prjUrl + row.ptName) {
                    result = {
                        projectGroup: {
                            rowid: row.prjgrpRowId
                        },
                        project: {
                            rowid: row.prjRowId,
                            url: row.prjUrl
                        },
                        pattern: {
                            rowid: row.ptRowId,
                            name: row.ptName
                        }
                    };
                    break;
                }
            }

            if (result !== null) {
                autofill.actionMapper.findAllByProjectGroupRowIdAndPatternRowId(result.projectGroup.rowid, result.pattern.rowid, function(rs) {
                    result.action = rs;
                    callback(result);
                });
            }
        });
    };

    var _upsertAction = function(action, callback) {
        autofill.actionMapper.upsert(action, callback);
    };

    return {

        /**
         *
         */
        findByUrlPattern: function(urlPattern, callback) {
            _findByUrlPattern(urlPattern, callback);
        },

        upsertAction: function(action, callback) {
            _upsertAction(action, callback);
        }

    };
})();
