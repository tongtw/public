String.format = function () {
    if (arguments.length == 0) {
        return null;
    }
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

$(document).ready(function () {
    $("#searchRstArea").hide();
    $("#searchContent").keyup(function () {
        var searchContent = $("#searchContent").val().toLowerCase().replace(/\s/g, "");
        if (searchContent.length <= 0) {
            $("#searchRstArea").hide();
            return;
        }

        var line = "<tr><td>{0}. <a href='{1}'>{2}</a></td></tr>"
        var rstHtml = "";
        var rstMap = new Map();
        $.get("/index.xml", function (xmltext, status) {
            var items = $(xmltext).find('item');
            for (var index = 0; index < items.length; index++) {
                var title = $(items[index]).children('title').text();
                var link = $(items[index]).children('link').text();
                if (title.toLowerCase().replace(/\s/g, "").indexOf(searchContent) < 0) {
                    continue;
                }
                rstMap.set(link, title);
            }
            if (rstMap.size > 0) {
                var index = 1;
                for (let link of rstMap.keys()) {
                    rstHtml += String.format(line, index, link, rstMap.get(link))
                }
                $("#searchRst").html(rstHtml);
                $("#searchRstArea").show();
            } else {
                $("#searchRstArea").hide();
            }
        })
    })
});