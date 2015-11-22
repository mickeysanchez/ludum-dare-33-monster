'use strict';

angular.module('monsterApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/beastiswithinyou',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });
