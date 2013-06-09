$(function() {

chrome.runtime.sendMessage({
    operation:  "ask",
    urlPattern: location.href
}, function(autofillInfo) {
    $.each(autofillInfo.action, function(idx, action) {
        var target = action.tagName + "[name='" + action.attrName + "']";

        $(target).val(action.value);

/*
        if ($(target).attr("onchange")) {
            $(target).tritter("change");
        }
*/
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
