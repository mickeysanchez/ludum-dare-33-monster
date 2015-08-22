'use strict';

angular.module('monsterApp')
  .controller('MainCtrl', function($scope, $http, socket) {
    $scope.numSquares = 10;
    $scope.calcPercent = 100 / $scope.numSquares;

    $scope.selected = {
      is_selected: false
    };

    $scope.select = function(newlySelected) {
      $scope.selected.is_selected = false;
      newlySelected.is_selected = true;
      $scope.selected = newlySelected;
    }

    $scope.createSquare = function(x, y) {
      return {
        is_selected: false,
        style: {
          background: 'grey',
          width: $scope.calcPercent + "%"
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
  });
