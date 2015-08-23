angular.module('monsterApp')
  .service('Player', function($mdDialog) {
    var self = this;

    self.day = 0;
    self.money = 0;
    self.violence = 0;
    self.heat = 0;
    self.items = [];

    self.buy = function(item) {
      if (!_.some(self.items, item)) {
        if (item.price <= self.money) {
          self.money -= item.price;
          self.items.push(item);
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
