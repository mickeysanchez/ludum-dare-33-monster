angular.module('monsterApp')
  .factory('Items', function() {
    return {
      list: [{
        name: "Lockpick Kit",
        desc: "Use this to break in more quietly and increase your chances of success.",
        successModifier: 5,
        violenceModifier: 0,
        capacityModifier: 0,
        price: 50
      }, {
        name: "Knife",
        desc: "Allows you to do more violence.",
        successModifier: 0,
        violenceModifier: 5,
        capacityModifier: 0,
        price: 50
      }, {
        name: "Backpack",
        desc: "Put more loot in here.",
        successModifier: 0,
        violenceModifier: 0,
        capacityModifier: 5,
        price: 50
      }, {
        name: "Gun",
        desc: "Much more violence. Accidental violence likely to occur.",
        successModifier: 0,
        violenceModifier: 20,
        capacityModifier: 0,
        price: 200
      }]
    }
  });
