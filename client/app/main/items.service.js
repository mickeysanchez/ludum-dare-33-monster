angular.module('monsterApp')
  .factory('Items', function() {
    return {
      list: [{
        name: "Cigarettes",
        desc: "Cool your nerves a little bit.",
        successModifier: 3,
        violenceModifier: 0,
        capacityModifier: 0,
        price: 10
      }, {
        name: "Baseball Bat",
        desc: "Intimidation is key to cooperation.",
        successModifier: 0,
        violenceModifier: 3,
        capacityModifier: 0,
        price: 20
      }, {
        name: "Backpack",
        desc: "Put more loot in here.",
        successModifier: 0,
        violenceModifier: 0,
        capacityModifier: 3,
        price: 20
      }, {
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
        name: "Duffel Bag",
        desc: "Haul away more valuable goods.",
        successModifier: 0,
        violenceModifier: 0,
        capacityModifier: 7,
        price: 35
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
      }, {
        name: "Down payment on a house outside the city",
        desc: "Change your surroundings. The only way to win the game.",
        successModifier: 0,
        violenceModifier: 0,
        capacityModifier: 0,
        price: 10000
      }, {
        name: "Ski Mask",
        desc: "Conceal your identity.",
        successModifier: 5,
        violenceModifier: 0,
        capacityModifier: 0,
        price: 10
      }, {
        name: "Shotgun",
        desc: "Easier to hit people. Harder to conceal. Really loud.",
        successModifier: -10,
        violenceModifier: 30,
        capacityModifier: 0,
        price: 350
      }, {
        name: "Car",
        desc: "Stop relying on someone else to get around.",
        successModifier: 15,
        violenceModifier: 0,
        capacityModifier: 50,
        price: 3000
      }, {
        name: "Cocaine",
        desc: "Get revved up.",
        successModifier: 10,
        violenceModifier: 10,
        capacityModifier: 0,
        price: 100
      }]
    }
  });
