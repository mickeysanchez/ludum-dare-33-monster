angular.module('monsterApp')
  .service('Player', function($mdDialog, $window) {
    var self = this;

    self.day = 0;
    self.money = 0;
    self.violence = 0;
    self.dishonesty = 0;
    self.heat = 0;
    self.items = [];

    self.buy = function(item) {
      if (!self.has(item)) {
        if (item.price <= self.money) {
          self.money -= item.price;
          self.items.push(item);
          if (item.name != "Down payment on a house outside the city") {
            $mdDialog.show(
              $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('You aquired the ' + item.name + ".")
              .ok('OK')
            )
          } else {
            $mdDialog.show(
              $mdDialog.alert()
              .clickOutsideToClose(true)
              .title("I don't know what you did to get here, but congratulations. You won the game.")
              .ok('Play Again')
            )
            .finally(function () {
              $window.location.reload();
            })
          }
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

    self.has = function(item) {
      return _.some(self.items, item)
    }

    self.successModifier = function() {
      var success = 0;
      _.each(self.items, function(item) {
        success += item.successModifier;
      })
      var successPercent = success / 100;
      return successPercent;
    }

    self.possibleViolence = function() {
      var v = 100;
      _.each(self.items, function(item) {
        v += item.violenceModifier;
      })
      return v;
    };

    self.capacityModifier = function() {
      var capacity = 0;
      _.each(self.items, function(item) {
        capacity += item.capacityModifier;
      })
      return capacity / 100;
    }
  })
