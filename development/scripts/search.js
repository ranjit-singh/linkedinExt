'use strict';
chrome.extension.onMessage.addListener(
function (request, sender, sendResponse) {

    if (request.action == 'PageInfo') {
        var pageInfos = [];

        $('#search').find('a').each(function() {
            var pageInfo = {};

            var href = $(this).attr('href');

            if (href != null && href.indexOf("http") == 0 && href.indexOf('linkedin')!=-1)
            {
                //only add urls that start with http
                pageInfo.url = href
                pageInfos.push(pageInfo);
                var htmlElm='<span style=" position: absolute;left: -18%;"><input type="button" value="Add Profile" onclick="addProfileUrl(event)" style="border: none;padding: 5px;background: #000fff;color: #fff;"></span>';
                $(this).closest('h3').append(htmlElm);
            }
        });
        sendResponse(pageInfos);
    }
});
