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
  window.addEventListener("load", function() {
    var app = angular.module('WittyParrotExt', []);

    var html = document.querySelector('html');
    html.setAttribute('ng-app', '');
    html.setAttribute('ng-csp', '');

    var viewport = document.getElementById('pagekey-public_profile_v3_desktop');
    viewport.setAttribute('ng-controller', 'MainController');
    app.controller('MainController', function ($scope, prospector) {
      var openWin, intervalID;
      $scope.checkWindow=function(){
              if (openWin && openWin.closed) {
                  window.clearInterval(intervalID);
                  alert("close");
              }
            };
      $scope.addProfileUrl=function(e, evt){
        var BodyHtml=$('body').html().replace("\n", '');
        var Obj={};
            Obj.source=1;
            Obj.userName="vikram@wittyparrot.com";
            Obj.url=[BodyHtml];
            
            //openWin = window.open(Obj.url[0], 'Linkedin public data', 'location=yes,status=yes,scrollbars=yes,resizable=yes,width=650,height=450,left=50');
            //openWin.focus();
            //intervalID = window.setInterval($scope.checkWindow, 500);


            /*chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
            console.log(response.farewell);
          });*/
            prospector.postCall(Obj).then(function(response){
              alert(JSON.stringify(response));
            });
      };
    }).service("prospector", function($http, $q){
      var baseUrl="http://52.7.44.174:8080/linkedin-1.0-SNAPSHOT/submitprofiles";
          this.postCall=function(urlParam){
            var deferred = $q.defer();
            $http.post(baseUrl, urlParam).then(function(response){
              deferred.resolve(response.data);
            }).then(null, function(response){
              deferred.reject(response);
            });
            return deferred.promise;
          };
    });
  //  var autoCompleteWin = document.querySelector('.gssb_e');
  //  angular.element(autoCompleteWin).remove();
    var myDirective = document.createElement('div');
        myDirective.setAttribute('my-directive', '');
        $("#name").append(myDirective);
    $('#search').find('a').each(function() {
        var href = $(this).attr('href');
        if (href != null && href.indexOf("http") == 0 && href.indexOf('linkedin')!=-1)
        {
            //only add urls that start with http
            var myDirective = document.createElement('div');
            myDirective.setAttribute('my-directive', '');
            $(this).closest('h3').append(myDirective);
        }
    });
    app.directive('myDirective', [ '$sce', function($sce) {
      return {
        restrict: 'EA',
        replace: true,
        templateUrl: $sce.trustAsResourceUrl(chrome.extension.getURL('templates/addButtonList.html'))
      };
    }]);
    angular.bootstrap(html, ['WittyParrotExt'], []);
  });
})();
