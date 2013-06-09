(function() {

var db = openDatabase("autofill", "", "autofill", 10485760);

db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS project (projectGroupRowId, url, active)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS projectGroup (name)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS action (projectGroupRowId, patternRowId, tagName, attrName, value)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS pattern (name)");
}, function(error) {
    console.log(error);
});

})();
