'use strict';

angular.module('monsterApp')
  .controller('MainCtrl', function($scope, $http, socket, GridMaker, $mdDialog) {
    $scope.init = function() {
      $scope.numSquares = 100;
      $scope.calcPercent = 100 / $scope.numSquares;
      $scope.robbing = false;
      $scope.player = {
        day: 1,
        money: 0,
        violence: 50,
        heat: 0
      }
      $scope.lastRobbing = {}
      $scope.grid = GridMaker.newGrid($scope.numSquares);
    }

    // PLAYER ACTIONS
    $scope.startRobbing = function() {
      $scope.robbing = true;
    }

    $scope.cancelRob = function() {
      $scope.robbing = false;
    }

    $scope.rob = function() {
      if ($scope.determineSuccess()) {
        $scope.player.money += $scope.calcPayoff()
        $scope.lastRobbing.success = true;
      } else {
        $scope.lastRobbing.success = false;
      }
      $scope.robbing = false;
    }

    $scope.determineSuccess = function() {
      var randPercent = _.random(0.01, 1.0);
      console.log(randPercent)
      return randPercent < $scope.calcSuccessPercentage();
    }

    $scope.calcSuccessPercentage = function() {
      return $scope.selected.baseSuccessPercentage * ($scope.player.violence / 100);
    }

    $scope.calcPayoff = function() {
      var payoff = 0;
      var randPercent = _.random(.1, 1.0);
      payoff = Math.round($scope.selected.maximumPayoff * randPercent);
      $scope.lastRobbing.payoff = payoff;
      $scope.postRobbing = true;
      return payoff;
    }

    $scope.hidePostRobbing = function() {
      $scope.postRobbing = false;
    }

    // UTILS
    $scope.select = function(newlySelected) {
      $scope.selected = newlySelected;
    }

    // CALL INIT
    $scope.init();
  });
