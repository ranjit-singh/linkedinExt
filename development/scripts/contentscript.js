'use strict';

window.addEventListener("load", function() {
  var app = angular.module('WittyParrotExt', []);

  var html = document.querySelector('html');
  html.setAttribute('ng-app', '');
  html.setAttribute('ng-csp', '');

  var viewport = document.getElementById('gsr');
  viewport.setAttribute('ng-controller', 'MainController');
  app.controller('MainController', function ($scope) {

    $scope.addProfileUrl=function(e, evt){
      alert($(e.target).closest('h3').find('a').attr('href'));
    };
  });
  var autoCompleteWin = document.querySelector('.gssb_e');
  angular.element(autoCompleteWin).remove();
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
