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
      }, {
        name: "Getaway Driver",
        desc: "I hope you trust this guy... Split the money. Only lasts one night.",
        successModifier: 50,
        violenceModifier: 0,
        capacityModifier: 50,
        price: 0
      }, {
        name: "Rehab",
        desc: "You won't spend so much money on drugs. For a little while at least...",
        successModifier: 20,
        violenceModifier: 0,
        capacityModifier: 0,
        price: 1000
      }]
    }
  });
