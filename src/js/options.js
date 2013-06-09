$(function() {

var showProjectGroupList = function() {
    var id = "#js_list_project_group";

    $(id).empty();

    autofill.projectGroupMapper.findAll(function(row) {
        $("<li>").text(row.name).appendTo($(id));
    });
};

var buildProjectProjectGroup = function() {
    var id = "#js_input_project_project_group";

    $(id).empty();
    $("<option>").attr({ value: "--" }).text("グループを選択").appendTo(id);

    autofill.projectGroupMapper.findAll(function(row) {
        $("<option>").attr({ value: row.rowid }).text(row.name).appendTo(id);
    });
};

var showProjectList = function() {
    var id = "#js_list_project";

    $(id).empty();

    autofill.projectMapper.findAll(function(row) {
        $("<li>").text("[" + row.projectGroup.name + "] " + row.url).appendTo(id);
    });
};

var showPatternList = function() {
    var id = "#js_list_pattern";

    $(id).empty();

    autofill.patternMapper.findAll(function(row) {
        $("<li>").text(row.name).appendTo($(id));
    });
};

$("#js_form_project_group").submit(function(e) {
    e.preventDefault();

    var name = $("#js_input_project_group").val();

    if (name.length > 0) {
        autofill.projectGroupMapper.insert({ name: name }, function() {
            showProjectGroupList();
            buildProjectProjectGroup();
        });
    }
});

$("#js_form_project").submit(function(e) {
    e.preventDefault();

    var projectGroupRowId = $("#js_input_project_project_group").val(),
        url               = $("#js_input_project").val();

    if (/^\d+$/.test(projectGroupRowId) && url.length > 0) {
        autofill.projectMapper.insert({ projectGroup: { rowid: projectGroupRowId }, url: url }, function() {
            showProjectList();
        });
    }
});

$("#js_form_pattern").submit(function(e) {
    e.preventDefault();

    var name = $("#js_input_pattern").val();

    if (name.length > 0) {
        autofill.patternMapper.insert({ name: name }, function() {
            showPatternList();
        });
    }
});







showProjectGroupList();

buildProjectProjectGroup();
showProjectList();

showPatternList();



});
