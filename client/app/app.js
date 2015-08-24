'use strict';

angular.module('monsterApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ngMaterial'
  ])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
