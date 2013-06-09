$(function() {

chrome.runtime.sendMessage({
    operation:  "ask",
    urlPattern: location.href
}, function(autofillInfo) {
    $.each(autofillInfo.action, function(idx, action) {
        console.log(action);
    });

    $(document).change(function(e) {
        chrome.runtime.sendMessage({
            operation: "register",
            action: {
                projectGroupRowId: autofillInfo.projectGroup.rowid,
                patternRowId:      autofillInfo.pattern.rowid,
                tagName:           e.target.tagName,
                attrName:          e.target.name,
                value:             e.target.value
            }
        }, function() {});
    });
});

});
