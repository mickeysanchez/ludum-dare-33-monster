'use strict';

angular.module('monsterApp')
  .controller('MainCtrl', function($scope, $http, socket) {
    $scope.grid = new Array(400);
  });
