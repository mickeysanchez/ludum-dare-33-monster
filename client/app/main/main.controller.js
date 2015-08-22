'use strict';

angular.module('monsterApp')
  .controller('MainCtrl', function($scope, $http, socket) {
    $scope.numSquares = 10;
    $scope.calcPercent = 100 / $scope.numSquares;

    $scope.player = {
      money: 0
    }

    $scope.select = function(newlySelected) {
      $scope.selected = newlySelected;
    }

    $scope.createSquare = function(x, y) {
      var squareTypes = ["Residential", "Commercial"];
      var type = _.sample(squareTypes);
      var baseSuccessPercentage = _.random(.2, .9);
      var maximumPayoff = _.random(100, 10000)

      return {
        type: type,
        baseSuccessPercentage: baseSuccessPercentage,
        maximumPayoff: maximumPayoff,
        style: {
          width: $scope.calcPercent + "%",
          opacity: baseSuccessPercentage
        }
      }
    }

    $scope.newGrid = function() {
      var grid = [];
      for (var i = 0; i < $scope.numSquares; i++) {
        var row = []
        for (var j = 0; j < $scope.numSquares; j++) {
          row.push($scope.createSquare(j, i))
        }
        grid.push(row)
      }
      return grid;
    }

    $scope.grid = $scope.newGrid();

    $scope.rob = function() {
      $scope.player.money += $scope.selected.maximumPayoff;
    }
  });
