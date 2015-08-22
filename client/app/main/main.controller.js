'use strict';

angular.module('monsterApp')
  .controller('MainCtrl', function($scope, $http, socket, GridMaker, $mdDialog) {
    $scope.init = function() {
      $scope.numSquares = 50;
      $scope.calcPercent = 100 / $scope.numSquares;
      $scope.robbing = false;
      $scope.player = {
        day: 1,
        money: 0,
        violence: 0,
        heat: 0
      }
      $scope.lastRobbery = {}
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
        $scope.enactSuccessfulRobbery();
      } else {
        $scope.lastRobbery.success = false;
      }
      $scope.robbing = false;
      $scope.postRobbing = true;
    }

    $scope.enactSuccessfulRobbery = function() {
      $scope.lastRobbery.payoff = $scope.calcPayoff();
      $scope.player.money += $scope.lastRobbery.payoff;
      $scope.lastRobbery.success = true;
      $scope.selected.robbed = true;
      $scope.selected.baseSuccessPercentage = .05;
      $scope.selected.maximumPayoff -= $scope.lastRobbery.payoff;
      $scope.player.heat += $scope.calcHeat();
      $scope.player.day += 1;

      $scope.affectNeighbors();
    }

    $scope.affectNeighbors = function() {
      var MAX_EFFECT_RADIUS = 10;
      var MAX_EFFECT = .25;
      var violencePercent = ($scope.player.violence / 100);
      var effect_radius = Math.round(MAX_EFFECT_RADIUS * violencePercent)

      var topLeft = $scope.selected.y - effect_radius;
      var topRight = $scope.selected.y + effect_radius;
      var topLeftX = $scope.selected.x - effect_radius;
      var bottomLeftX = $scope.selected.x + effect_radius;
      for (var y = topLeft; y < topRight; y++) {
        for (var x = topLeftX; x < bottomLeftX; x++) {
          if (y >= 0 && y < $scope.numSquares && x >= 0 && x < $scope.numSquares) {
            $scope.grid[y][x].baseSuccessPercentage -= (violencePercent * MAX_EFFECT * _.random(.5, 1))
          }
        }
      }
    }

    $scope.determineSuccess = function() {
      var randPercent = _.random(0.01, 1.0);
      return randPercent < $scope.calcSuccessPercentage();
    }

    $scope.calcSuccessPercentage = function() {
      var violencePercent = ($scope.player.violence / 100);
      return $scope.selected.baseSuccessPercentage * violencePercent;
    }

    $scope.calcPayoff = function() {
      var payoff = 0;
      var randPercent = _.random(.1, 1.0);
      payoff = Math.round($scope.selected.maximumPayoff * randPercent);
      $scope.lastRobbery.payoff = payoff;
      $scope.postRobbing = true;
      return payoff;
    }

    $scope.calcHeat = function() {
      var violencePercent = ($scope.player.violence / 100);
      return violencePercent * 100;
    }

    $scope.calcOpacity = function(square) {
      if (square.type == "Road") {
        return 1
      } else {
        return (1 - square.baseSuccessPercentage);
      }
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
