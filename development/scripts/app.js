/**
 * @ngdoc overview
 * @name WittyParrot Linkedin Search
 * @description WittyParrot Linkedin Search
 *
 * Main module of the application.
 */
'use strict';
var searchApp = angular.module('WittyParrotProspector', ['ui.router','checklist-model'])
.config(['$stateProvider','$rootScopeProvider','$urlRouterProvider', function ($stateProvider, $rootScopeProvider, $urlRouterProvider) {
                //$locationProvider.html5Mode(true);
                $rootScopeProvider.digestTtl(100);
                $urlRouterProvider.otherwise('/');
                $stateProvider
                        .state('login', {
                            url: '/',
                            templateUrl: '../views/login.html',
                            resolve:{
                              authenticated: function($location) {
                                        if (docCookies.getItem('tokenKey')) {
                                            $location.path('/main');
                                            return;
                                        }
                                    }
                            }
                        })
                        .state('main', {
                          url:'/main',
                          templateUrl: '../views/main.html'
                        });
}]);
searchApp.service("searchExtService", function($http, $q, $location){
    var baseUrl="http://ec2-54-165-121-127.compute-1.amazonaws.com:8080/alfresco/service/acrowit/";
        this.login=function(urlParam){
          var deferred = $q.defer();
          $http.post(baseUrl+'login', urlParam).then(function(response){
            var now = new Date(), time = now.getTime();
            time += 36000 * 1000;
            now.setTime(time);
            docCookies.setItem("tokenKey", response.data.respList[0].ticket, now.toUTCString(), "/");
            deferred.resolve(response.data);
          }).then(null, function(response){
            deferred.reject(response);
          });
          return deferred.promise;
        };
        this.logout=function(){
          var deferred = $q.defer();
          $http.get(baseUrl+'logout?access_token='+docCookies.getItem("tokenKey")).then(function(response){
            docCookies.removeItem('tokenKey');
            $location.path('/');
            window.location.reload();
            deferred.resolve(response.data);
          }).then(null, function(response){
            docCookies.removeItem('tokenKey');
            $location.path('/');
            window.location.reload();
            deferred.reject(response);
          });
          return deferred.promise;
        };
        this.searchLinkedinProfile=function(){
          // Not implemented
        };
        this.addLinkedinProfile=function(urlParam){
          var deferred = $q.defer();
          $http.post('http://192.168.47.134:7030/wittyparrot/profile', urlParam).then(function(response){
            deferred.resolve(response.data);
          }).then(null, function(response){
            deferred.reject(response);
          });
          return deferred.promise;
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
})
.controller("mainExtCtrl", function($scope, searchExtService, $location){
        $scope.login=function(userName, password){
          var urlParam={};
          urlParam.userName=userName;
          urlParam.password=password;
          urlParam.isEncript=false;
          searchExtService.login(urlParam).then(function(response){
            if(!response.error){
              $location.path('/main');
              console.log("Successfully loged-in.");
            }
          });
        };
          $scope.logout=function(){
            searchExtService.logout().then(function(response){
                console.log("Successfully loged-out.");
            });
          };
      })
.controller("searchExtCtrl", function($scope, searchExtService){
              var contactList=[], startIndex=11;
              var urlOpen='https://www.googleapis.com/customsearch/v1?key=AIzaSyB0rx6rbvzgktpbkDjbfEN0iGFe8rxyRNc&cx=005715890520657954213:jocayv96px0&q=';
              $scope.profileObj={};
              $scope.profileObj.linkedinProfileList=[];
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
                var searchItem=($(this).find('input[name=keywords]').val()+' "'+$(this).find('input[name=title]').val().split(",").join(' * * * Present" OR "') + ' * * * Present"')+(' "'+$(this).find('input[name=industry]').val().split(",").join('" OR "') + '"')+' "Location * '+$(this).find("input[name=location]").val()+'" '+"site:in.linkedin.com/in/ OR site:in.linkedin.com/pub/ -site:in.linkedin.com/pub/dir/";
                urlOpen=urlOpen+searchItem;
                searchExtService.getList(urlOpen).then(function(response){
                  $scope.searchResult=response.items;
                  $scope.pageInfos=response.searchInformation.totalResults;
                });
                //chrome.tabs.create({url: urlOpen, selected: true}, function(tab){ })
                return true;
              });
              /*searchExtService.getInfo(function (info) {
                  $scope.pageInfos = info.pageInfos;
                  $scope.$apply();

              });*/
              /* Start this function is to select Linkedin profile for all/single */
                $scope.selectAllLinkedinProfile = function(isSelectAllAccount) {
                    if (isSelectAllAccount) {
                        $scope.profileObj.linkedinProfileList = angular.copy($scope.searchResult);
                        for (var i = 0; i < $scope.profileObj.linkedinProfileList.length; i++) {
                          var name=$scope.profileObj.linkedinProfileList[i].title.split(' | ');
                        if($scope.profileObj.linkedinProfileList[i].pagemap.person[0].org)  contactList.push({
                            "name":name[0],
                            "org":$scope.profileObj.linkedinProfileList[i].pagemap.person[0].org,
                            "role":$scope.profileObj.linkedinProfileList[i].pagemap.person[0].role,
                            "location":$scope.profileObj.linkedinProfileList[i].pagemap.person[0].location,
                            "html":"",
                            "linkedInUrl":$scope.profileObj.linkedinProfileList[i].link
                          });
                        }
                    } else {
                        $scope.profileObj.linkedinProfileList=[];
                        contactList=[];
                    }
                };
                $scope.selectLinkedinProfile = function(profile, val, $index) {
                    if (val) {
                      var name=profile.title.split(' | ');
                      contactList.push({
                        "name":name[0],
                        "org":profile.pagemap.person[0].org,
                        "role":profile.pagemap.person[0].role,
                        "location":profile.pagemap.person[0].location,
                        "html":"",
                        "linkedInUrl":profile.link
                      });
                    } else {
                      contactList.splice($index, 1);
                    }
                };
                /* End this function is to select Linkedin profile for all/single */
                $scope.addContact=function(){    
                  searchExtService.addLinkedinProfile({"wpUserName":"ranjit@wittyparrot.com","googleUserModel":contactList}).then(function(response){
                    console.log(response);
                  });
                };
                $scope.loadMoreProfile=function(){
                  searchExtService.getList(urlOpen+'&start='+startIndex).then(function(response){
                    $scope.searchResult=$scope.searchResult.concat(response.items);
                    startIndex+=10;
                  });
                };
              $scope.clearSearchField=function(){
                $('.ui.dropdown').dropdown('clear');
              };
});
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });
