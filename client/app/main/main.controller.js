'use strict';

angular.module('monsterApp')
  .controller('MainCtrl', function($scope, $http, socket, GridMaker, $mdDialog, Items) {
    $scope.init = function() {
      $scope.numSquares = 40;
      $scope.robbing = false;
      $scope.player = {
        day: 1,
        money: 0,
        violence: 0,
        heat: 0,
        items: []
      }
      $scope.lastRobbery = {}
      $scope.grid = GridMaker.newGrid($scope.numSquares);
      $scope.alertedProperties = [];
      $scope.items = Items.list;
      $scope.preGame = true;
    }

    $scope.startGame = function() {
      $scope.preGame = false;
    }

    $scope.startRobbing = function() {
      $scope.robbing = true;
    }

    $scope.cancelRob = function() {
      $scope.robbing = false;
    }

    $scope.hidePostRobbing = function() {
      $scope.postRobbing = false;
      $scope.postPostRobbing = true;
    }

    $scope.hidePostPostRobbing = function() {
      $scope.player.money -= $scope.lastRobbery.randomEvent.randomCashSpend;
      $scope.postPostRobbing = false;
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
      $scope.lastRobbery.violence = $scope.player.violence;
      $scope.player.heat += $scope.calcHeat();
      $scope.lastRobbery.randomEvent = $scope.randomEvent();

      $scope.nextDay();
      $scope.affectNeighbors();
    }

    $scope.nextDay = function() {
      var DAYS_TIL_OFF_ALERT = 10;
      $scope.player.day += 1;

      // _.each($scope.alertedProperties, function(el) {
      //   if ($scope.player.day - el.alertedOn > DAYS_TIL_OFF_ALERT) {

      //   }
      // })
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
            if (Math.abs(y - $scope.selected.y) + Math.abs(x - $scope.selected.x) < effect_radius) {
              var square = $scope.grid[y][x];
              square.baseSuccessPercentage -= (violencePercent * MAX_EFFECT * _.random(.5, 1))
              square.onAlert = true;
              square.alertedOn = $scope.player.day;
              $scope.alertedProperties.push(square);
            }
          }
        }
      }
    }

    $scope.determineSuccess = function() {
      var randPercent = _.random(0.01, 1.0);
      return randPercent < $scope.calcSuccessPercentage();
    }

    $scope.itemSuccess = function() {
      var success = 0;
      _.each($scope.player.items, function(item) {
        success += item.successModifier;
      })
      var successPercent = success / 100;
      return successPercent;
    }

    $scope.calcSuccessPercentage = function() {
      var violencePercent = ($scope.player.violence / 100);

      var successPercent = $scope.selected.baseSuccessPercentage + $scope.itemSuccess();

      return (successPercent / 2) + (violencePercent * (successPercent / 2));
    }

    $scope.calcPayoff = function() {
      var capacity = 0;
      _.each($scope.player.items, function(item) {
        capacity += item.capacityModifier;
      })
      var capacityPercent = capacity / 100;
      var payoff = 0;
      var randPercent = _.random(.5 + capacityPercent, 1.0);
      payoff = Math.round($scope.selected.maximumPayoff * randPercent);
      $scope.lastRobbery.payoff = payoff;
      return payoff;
    }

    $scope.calcHeat = function() {
      var violencePercent = ($scope.player.violence / 100);
      return violencePercent * 100;
    }

    $scope.calcTotalViolence = function() {
      var v = 100;
      _.each($scope.player.items, function(item) {
        v += item.violenceModifier;
      })
      return v;
    }

    $scope.calcOpacity = function(square) {
      if (square.type == "Road") {
        return 1
      } else {
        return (1 - square.baseSuccessPercentage);
      }
    }

    $scope.select = function(newlySelected) {
      $scope.selected = newlySelected;
    }

    // STORE
    $scope.buy = function(item) {
      if (!_.some($scope.player.items, item)) {
        if (item.price < $scope.player.money) {
          $scope.player.money -= item.price;
          $scope.player.items.push(item);
          $mdDialog.show(
            $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('You bought the ' + item.name + ".")
            .ok('OK')
          )
        } else {
          $mdDialog.show(
            $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('Not enough money.')
            .ok('OK')
          )
        }
      } else {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('You\'ve already got one.')
          .ok('OK')
        )
      }
    }

    // RANDOM EVENTS
    $scope.randomEvent = function() {
      var phrases = ["Filled with adrenaline from last night's robbery", "Trying to forget past violence", "Trying to relax after last night's robbery", "Feeling on top of the world", "Feeling like nothing bad will every happen to you", "Stressed out from the robbery", "Feeling especially paranoid about getting caught"]
      var reasons = ["you meet up with some prison buddies for a good time. They convince you to pay for everything", "you get a motel room and hole up", "you go to the casino", "you go to a bar", "you spend the whole day in a bar", "you look for drugs"]
      var spends = ["on drugs", "on drinks", "on random shit you can't even remember", "gambling", "on a hotel room"]
      var rand = Math.round(_.random($scope.player.money / 10, $scope.player.money / 2));
      var randomCashSpend = rand;
      return {
        phrase: _.sample(phrases),
        reason: _.sample(reasons),
        spentOn: _.sample(spends),
        randomCashSpend: randomCashSpend
      }
    }


    // CALL INIT
    $scope.init();
  });
