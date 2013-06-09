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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.operation) {
        case "ask":
            autofill.autofillMapper.findByUrlPattern(request.urlPattern, function(autofillInfo) {
                sendResponse(autofillInfo);
            });
            break;
        case "register":
            autofill.autofillMapper.upsertAction(request.action);
            break;
    }
    return true;
});

})();
