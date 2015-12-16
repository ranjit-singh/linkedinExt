'use strict';
(function(){
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
              }
          });
          sendResponse(pageInfos);
      }
  });
})();
