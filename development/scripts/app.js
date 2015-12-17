/**
 * @ngdoc overview
 * @name WittyParrot Linkedin Search
 * @description WittyParrot Linkedin Search
 *
 * Main module of the application.
 */
'use strict';
var searchApp = angular.module('WittyParrotSearchExt', ['ui.router'])
.config(['$stateProvider','$rootScopeProvider','$urlRouterProvider', function ($stateProvider, $rootScopeProvider, $urlRouterProvider) {
                //$locationProvider.html5Mode(true);
                $rootScopeProvider.digestTtl(100);
                $urlRouterProvider.otherwise('/');
                $stateProvider
                        .state('login', {
                            url: '/',
                            templateUrl: '../views/login.html'
                        });
}]);
searchApp.service("searchExtService", function($http, $q){
        this.searchLinkedinProfile=function(){
          // Not implemented
        };
        this.addLinkedinProfileUrl=function(){
          // Not implemented
        };

        this.getList=function(urlParam){
          var deferred = $q.defer();
          $http.get(urlParam).then(function(response){
            deferred.resolve(response.data);
          }).then(null, function(response){
            deferred.reject(response);
          });
          return deferred.promise;
        };

        this.getInfo = function(callback) {
          var model = {};

          chrome.tabs.query({'active': true},
          function (tabs) {
              if (tabs.length > 0)
              {
                  model.title = tabs[0].title;
                  model.url = tabs[0].url;

                  chrome.tabs.sendMessage(tabs[0].id, { 'action': 'PageInfo' }, function (response) {
                      model.pageInfos = response;
                      callback(model);
                  });
              }

          });
      };
}).controller("searchExtCtrl", function($scope, searchExtService){
              searchExtService.getList('scripts/title.json').then(function(response){
                $scope.titleInfo=response.results;
              });
              searchExtService.getList('scripts/industry.json').then(function(response){
                $scope.industryInfo=response.results;
              });
              searchExtService.getList('scripts/country.json').then(function(response){
                $scope.countryInfo=response.results;
              });
              searchExtService.getList('scripts/location.json').then(function(response){
                $scope.locationInfo=response.results;
                $('.ui.dropdown').dropdown();
              });
              $('#searchForm').submit(function(event){
                var urlOpen='http://www.google.com/search?gws_rd=cr&as_qdr=all&q=';
                var searchItem=(' "'+$(this).find('input[name=title]').val().split(",").join(' * * * Present" OR "') + ' * * * Present"')+(' "'+$(this).find('input[name=industry]').val().split(",").join('" OR "') + '"')+' "Location * '+$(this).find("input[name=location]").val()+'" '+"site:in.linkedin.com/in/ OR site:in.linkedin.com/pub/ -site:in.linkedin.com/pub/dir/";
                urlOpen=urlOpen+searchItem;

                chrome.tabs.create({url: urlOpen, selected: true}, function(tab){ })
                return true;
              });
              searchExtService.getInfo(function (info) {
                  $scope.pageInfos = info.pageInfos;
                  $scope.$apply();
              });
              $scope.clearSearchField=function(){
                $('.ui.dropdown').dropdown('clear');
                 chrome.windows.create({'url': '../views/main.html', 'type': 'popup'}, function(window) {
                 });
              };
              $scope.message = "Hello from AngularJS";
});
