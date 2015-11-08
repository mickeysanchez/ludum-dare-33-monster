'use strict';

var MAP_SIZE = 40;
var DAYS_TIL_OFF_ALERT = 10; // Days until nearby properties off alert.
var MAX_EFFECT_RADIUS = 15; // Radius around robbed property that goes on alert.
var MAX_EFFECT = .25; // Max percent alerted properties can be raised. (success)
var GETAWAY_MISHAP_OUT_OF_TEN = 8; // This number out of ten times something will go wrong with getaway driver;
var MIN_RAND_EVENT_SPEND_PERCENT = .05; // Minimum percent of total money spent on random events.
var MAX_RAND_EVENT_SPEND_PERCENT = .3; // Maximum percent of total money spent on random events.


angular.module('monsterApp')
  .controller('MainCtrl', function($scope, $http, GridMaker, $mdDialog, Items, Player) {
    $scope.init = function() {
      $scope.numSquares = MAP_SIZE;
      $scope.robbing = false;
      $scope.courtHearing = false;
      $scope.player = Player;
      $scope.lastRobbery = {}
      $scope.grid = GridMaker.newGrid($scope.numSquares);
      $scope.alertedProperties = [];
      $scope.items = _.sortBy(Items.list, function(item) {
        return item.price
      });
      $scope.preGame = true;
      $scope.resetSettings();
      // createjs.Sound.registerSound("assets/music/monster.mp3", "music");
    }

    $scope.startGame = function() {
      // createjs.Sound.play("music", {
      //   loop: -1
      // });
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

    $scope.applyForJob = function() {
      $scope.applyingForJob = true;
    }

    $scope.cancelApplyJob = function() {
      $scope.applyingForJob = false;
    }

    $scope.work = function() {
      $scope.randWorkHours = _.random(3, 8);
      $scope.daysPay = Math.round($scope.randWorkHours * $scope.employedAt.jobPay);
      $scope.employedAt.workedOn = $scope.player.day;
      $scope.working = true;
    }

    $scope.postWorking = function() {
      $scope.player.money += $scope.daysPay;
      $scope.working = false;
      $scope.progressDay();
      $scope.lastRobbery.randomEvent = $scope.randomEvent();
      $scope.postPostRobbing = true;
    }

    $scope.hidePostRobbing = function() {
      $scope.postRobbing = false;
      $scope.postPostRobbing = true;
    }

    $scope.hidePostPostRobbing = function() {
      $scope.player.money -= $scope.lastRobbery.randomEvent.randomCashSpend;
      $scope.postPostRobbing = false;
    }

    $scope.hidePostApplying = function() {
      $scope.postApplyingForJob = false
    }

    $scope.hideCourtHearing = function() {
      if ($scope.lastRobbery.guilty) {
        $scope.player.day += $scope.lastRobbery.randomEvent.possibleJailtime * 365;

        var new_items = []
        _.each($scope.player.items, function(item) {
          if (item.name == 'Rehab')
            new_items.push(item);
        })
        $scope.player.items = new_items;

      } else {
        $scope.player.day += 2;
      }

      $scope.player.heat = $scope.player.heat / 2;
      $scope.courtHearing = false;

      $scope.deAlertProperties();
    }

    $scope.rob = function() {
      $scope.lastRobbery.violence = $scope.player.violence;

      if ($scope.determineSuccess()) {
        $scope.enactSuccessfulRobbery();
      } else {
        $scope.enactFailedRobbery();
      }

      $scope.player.heat += $scope.calcHeat();
      $scope.selected.robbed = true;
      $scope.selected.baseSuccessPercentage = .05;
      $scope.selected.maximumPayoff -= $scope.lastRobbery.payoff;

      $scope.robbing = false;
      $scope.postRobbing = true;

      $scope.alertNeighbors();
      $scope.progressDay();
    }

    $scope.enactSuccessfulRobbery = function() {
      $scope.lastRobbery.success = true;
      $scope.lastRobbery.payoff = $scope.calcPayoff();

      $scope.player.money += $scope.lastRobbery.payoff;

      $scope.lastRobbery.randomEvent = $scope.randomEvent();

      $scope.deAlertProperties();
    }

    $scope.enactFailedRobbery = function() {
      $scope.lastRobbery.success = false;
      $scope.lastRobbery.payoff = Math.round($scope.player.money * _.random(.5, .9));
      $scope.lastRobbery.randomEvent = $scope.randomFailEvent();
    }

    $scope.applyToJob = function() {
      if (_.random(0.01, 1.0) < ($scope.calcSuccessPercentageJob() + .05)) {
        enactSuccessfulJobApplication();
      } else {
        enactFailedJobApplication();
      }

      $scope.applyingForJob = false;
      $scope.postApplyingForJob = true;
      $scope.progressDay();
    }

    function enactSuccessfulJobApplication() {
      $scope.selected.employedHere = true;
      if ($scope.employedAt) {
        $scope.employedAt.fired = true;
        $scope.employedAt.employedHere = false;
      }
      $scope.employedAt = $scope.selected;
      $scope.employedAt.workedOn = $scope.player.day;
    }

    function enactFailedJobApplication() {
      $scope.selected.failedApplication = true;
      $scope.selected.employedHere = false;
    }

    $scope.progressDay = function() {
      if ($scope.employedAt && $scope.player.day - $scope.employedAt.workedOn > 0) {
        $scope.employedAt.employedHere = false;
        $scope.employedAt.fired = true;
        $scope.employedAt = undefined;
      }
      $scope.player.day += 1;
      $scope.player.heat = $scope.player.heat - (_.random(0.01, .6) * $scope.player.heat);
    }

    $scope.deAlertProperties = function() {
      var newAlerts = [];
      _.each($scope.alertedProperties, function(property) {
        if ($scope.player.day - property.alertedOn > DAYS_TIL_OFF_ALERT) {
          property.baseSuccessPercentage = GridMaker.determineSuccessPercentage(property.type, property.maximumPayoff, property.x, property.y);
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
      if ($scope.selected) {
        var violencePercent = ($scope.player.violence / 100);
        var successPercent = $scope.selected.baseSuccessPercentage + $scope.player.successModifier();
        successPercent = (successPercent / 2) + (violencePercent * (successPercent / 2));
        successPercent = successPercent * $scope.modifier($scope.violenceEffectiveness)
        successPercent = successPercent / $scope.modifier($scope.difficulty)
        return successPercent;
      }
    }

    $scope.calcSuccessPercentageJob = function() {
      if ($scope.selected.fired) return 0;
      var dishonestyPercent = ($scope.player.dishonesty / 100);
      return ($scope.selected.jobSuccessPercentage / 2) + (dishonestyPercent * ($scope.selected.jobSuccessPercentage / 2));
    }

    $scope.calcPayoff = function() {
      var payoff = 0;
      var min = (.5 + $scope.player.capacityModifier());
      var randPercent = _.random(min, 1.0);
      payoff = $scope.selected.maximumPayoff * randPercent;
      payoff = $scope.getAwayDriver(payoff)
      payoff = Math.round(payoff);
      payoff = (payoff > $scope.selected.maximumPayoff) ? $scope.selected.maximumPayoff : payoff;
      payoff = payoff * $scope.modifier($scope.payoffModifier)
      $scope.lastRobbery.payoff = payoff;
      return Math.ceil(payoff);
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
      // if (square.type == "Road") {
      //   return 1
      // } else {
      // return (.9 - square.baseSuccessPercentage/4);
      // return 1;
      // }
    }

    $scope.goToCourt = function(lawyer) {
      var guilty = _.random(0, 10) > 1;
      if (lawyer) {
        if ($scope.player.money >= 500) {
          $scope.player.money -= 500;
          $scope.postRobbing = false;
          $scope.courtHearing = true;
        } else {
          $mdDialog.show(
            $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('Not enough money.')
            .ok('OK')
          )
        }
        guilty = _.random(0, 10) > 6;
      } else {
        $scope.postRobbing = false;
        $scope.courtHearing = true;
      }

      $scope.lastRobbery.guilty = guilty;
    }

    // RANDOM EVENTS
    $scope.randomEvent = function() {
      if ($scope.player.money > 0) {
        if (!_.some($scope.player.items, {
            name: "Rehab"
          })) {
          var phrases = ["Filled with adrenaline from last night's success", "Trying to forget past violence", "Trying to relax after last night's job", "Feeling on top of the world", "Feeling like nothing bad will every happen to you again", "Stressed out from, well... you know", "Feeling especially paranoid about getting caught"]
          var reasons = ["you meet up with some prison buddies for a good time. They convince you to pay for everything", "you get a motel room and hole up", "you go to the casino", "you go to a bar", "you spend the whole day in a bar", "you look for drugs"]
          var spends = ["on drugs", "on drinks", "on random shit you can't even remember", "gambling", "on a motel room"]
          var randomCashSpend = Math.ceil(_.random($scope.player.money * MIN_RAND_EVENT_SPEND_PERCENT, $scope.player.money * MAX_RAND_EVENT_SPEND_PERCENT));
          var heat = $scope.player.heat * $scope.modifier($scope.effectsOfStress)
          randomCashSpend += (heat + 1) / _.random(1, 10)
          randomCashSpend = randomCashSpend / $scope.modifier($scope.discipline)
          if (randomCashSpend > $scope.player.money)
            randomCashSpend = $scope.player.money
          return {
            phrase: _.sample(phrases),
            reason: _.sample(reasons),
            spentOn: _.sample(spends),
            randomCashSpend: Math.ceil(randomCashSpend)
          }
        } else {
          return {
            phrase: "You spent a quiet night on a friend's couch",
            reason: "rehab seems to be working",
            spentOn: "on groceries for your friend",
            randomCashSpend: 5
          }
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

    $scope.randomFailEvent = function() {
      var reasons = ['There was a hidden camera. The police picked you up on the street the next day.', 'The neighbors called the cops. The police ran you down in the street.', 'They were waiting for you. The police must have been tailing you.',
        'They were ready for you, and you got knocked out.'
      ];

      return {
        reason: _.sample(reasons),
        possibleJailtime: Math.ceil(_.random(1, 20) * $scope.modifier($scope.degreeOfPunish))
      }
    }

    $scope.itemImageName = function(name) {
      var name_arr = name.split(" ")
      return _.map(name_arr, function(name) {
        return name.toLowerCase()
      }).join("-") + ".png"
    }

    $scope.settingsToggle = function() {
      $scope.settingsOpen = !$scope.settingsOpen;
    }

    $scope.resetSettings = function() {
      // SETTINGS:
      $scope.difficulty = 100;
      $scope.payoffModifier = 100;
      $scope.degreeOfPunish = 100;
      $scope.discipline = 100;
      $scope.violenceEffectiveness = 100;
      $scope.effectsOfStress = 100;
    }

    $scope.modifier = function(setting) {
      return (setting + 0.1) / 100;
    }

    // CALL INIT
    $scope.init();
  });
