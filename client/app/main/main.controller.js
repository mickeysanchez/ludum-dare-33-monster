'use strict';

var DAYS_TIL_OFF_ALERT = 10; // Days until nearby properties off alert.
var MAX_EFFECT_RADIUS = 10; // Radius around robbed property that goes on alert.
var MAX_EFFECT = .25; // Max percent alerted properties can be raised. (success)
var GETAWAY_MISHAP_OUT_OF_TEN = 8; // This number out of ten times something will go wrong with getaway driver;

angular.module('monsterApp')
  .controller('MainCtrl', function($scope, $http, socket, GridMaker, $mdDialog, Items, Player) {
    $scope.init = function() {
      $scope.numSquares = 40;
      $scope.robbing = false;
      $scope.player = Player;
      $scope.lastRobbery = {}
      $scope.grid = GridMaker.newGrid($scope.numSquares);
      $scope.alertedProperties = [];
      $scope.items = _.sortBy(Items.list, function(item) {
        return item.price
      });
      $scope.preGame = true;
    }

    $scope.startGame = function() {
      $scope.preGame = false;
    }

    $scope.select = function(newlySelected) {
      $scope.selected = newlySelected;
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
      $scope.lastRobbery.success = true;
      $scope.lastRobbery.payoff = $scope.calcPayoff();
      $scope.lastRobbery.violence = $scope.player.violence;
      $scope.lastRobbery.randomEvent = $scope.randomEvent();

      $scope.player.money += $scope.lastRobbery.payoff;
      $scope.player.heat += $scope.calcHeat();

      $scope.selected.robbed = true;
      $scope.selected.baseSuccessPercentage = .05;
      $scope.selected.maximumPayoff -= $scope.lastRobbery.payoff;

      $scope.progressDay();
    }

    $scope.progressDay = function() {
      $scope.player.day += 1;
      $scope.alertNeighbors();
      $scope.deAlertProperties();
    }

    $scope.deAlertProperties = function() {
      var newAlerts = [];
      _.each($scope.alertedProperties, function(property) {
        if ($scope.player.day - property.alertedOn > DAYS_TIL_OFF_ALERT) {
          property.onAlert = false;
        } else {
          newAlerts.push(property);
        }
      })
      $scope.alertedProperties = newAlerts;
    }

    $scope.alertNeighbors = function() {
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

    $scope.calcSuccessPercentage = function() {
      var violencePercent = ($scope.player.violence / 100);
      var successPercent = $scope.selected.baseSuccessPercentage + $scope.player.successModifier();
      return (successPercent / 2) + (violencePercent * (successPercent / 2));
    }

    $scope.calcPayoff = function() {
      var payoff = 0;
      var min = (.5 + $scope.player.capacityModifier());
      var randPercent = _.random(min, 1.0);
      payoff = $scope.selected.maximumPayoff * randPercent;
      payoff = $scope.getAwayDriver(payoff)
      payoff = Math.round(payoff);
      payoff = (payoff > $scope.selected.maximumPayoff) ? $scope.selected.maximumPayoff : payoff;
      $scope.lastRobbery.payoff = payoff;
      return payoff;
    }

    $scope.getAwayDriver = function(payoff) {
      var getawayPercent = 0;
      $scope.lastRobbery.getawayDriver = false;
      $scope.lastRobbery.getawayMishap = false;
      var newItems = [];
      _.each($scope.player.items, function(item) {
        if (item.name != "Getaway Driver") {
          newItems.push(item)
        } else {
          $scope.lastRobbery.getawayDriver = true;
          $scope.lastRobbery.getawayMishap = _.random(0, 10) <= GETAWAY_MISHAP_OUT_OF_TEN;

          getawayPercent = _.random(1.1, 1.4);
          payoff = payoff * getawayPercent;

          if ($scope.lastRobbery.getawayMishap) {
            payoff = -_.random(0, $scope.player.money);
          }

          payoff = payoff / 2;
        }
        $scope.player.items = newItems;
      })

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

    // RANDOM EVENTS
    $scope.randomEvent = function() {
      if ($scope.player.money > 0) {
        var phrases = ["Filled with adrenaline from last night's robbery", "Trying to forget past violence", "Trying to relax after last night's robbery", "Feeling on top of the world", "Feeling like nothing bad will every happen to you again", "Stressed out from the robbery", "Feeling especially paranoid about getting caught"]
        var reasons = ["you meet up with some prison buddies for a good time. They convince you to pay for everything", "you get a motel room and hole up", "you go to the casino", "you go to a bar", "you spend the whole day in a bar", "you look for drugs"]
        var spends = ["on drugs", "on drinks", "on random shit you can't even remember", "gambling", "on a motel room"]
        var randomCashSpend = Math.ceil(_.random($scope.player.money / 10, $scope.player.money / 2));;
        return {
          phrase: _.sample(phrases),
          reason: _.sample(reasons),
          spentOn: _.sample(spends),
          randomCashSpend: randomCashSpend
        }
      } else {
        return {
          phrase: "You don't have any money",
          reason: "so you sleep on the street",
          spentOn: "on nothing..",
          randomCashSpend: 0
        }
      }
    }

    // CALL INIT
    $scope.init();
  });
