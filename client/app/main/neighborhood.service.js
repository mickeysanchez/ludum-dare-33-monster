angular.module('monsterApp')
  .factory('GridMaker', function() {
    function createSquare(x, y) {
      var type = createType(x, y);
      var name = createName(type);
      var maximumPayoff = determineMaxPayoff(type, x, y);
      var baseSuccessPercentage = determineSuccessPercentage(type, maximumPayoff, x, y);
      var opacity = determineOpacity(type, maximumPayoff)

      return {
        type: type,
        baseSuccessPercentage: baseSuccessPercentage,
        maximumPayoff: maximumPayoff,
        style: {
          // width: $scope.calcPercent + "%",
          // opacity: opacity
        },
        info: {
          name: name
        }
      }
    }

    function createType(x, y) {
      var squareTypes = ["Residential", "Commercial", "Road"];
      type = "Residential";
      type = (_.random(0, 100) < 25) ? "Commercial" : type;
      type = (_.random(0, 100) < 50) ? "Road" : type;
      return type;
    }

    function createName(type) {
      if (type == "Residential") {
        return chance.last() + " Family"
      } else if (type == "Commercial") {
        var businessTypes = ["Convenience Store", "Gas Station", "Shoes", "Clothing", "Pawn Shop"]
        return chance.capitalize(chance.word()) + " " + _.sample(businessTypes);
      } else {
        return ""
      }
    }

    var MIN_POSSIBLE_PAYOFF = 0;
    var MAX_POSSIBLE_PAYOFF = 10000;

    function determineMaxPayoff(type, x, y) {
      if (type == "Road") {
        return 0;
      } else {
        return _.random(MIN_POSSIBLE_PAYOFF, MAX_POSSIBLE_PAYOFF);
      }
    }

    function determineSuccessPercentage(type, maximumPayoff, x, y) {
      if (type == "Road") {
        return 0;
      } else {
        var percentPayoff = maximumPayoff / MAX_POSSIBLE_PAYOFF
        return 1 - percentPayoff;
      }
    }

    function determineOpacity(type, payoff) {
      if (type == "Road") {
        return 1
      } else {
        return payoff / MAX_POSSIBLE_PAYOFF;
      }
    }

    var newGrid = function(numSquares) {
      var grid = [];
      for (var i = 0; i < numSquares; i++) {
        var row = []
        for (var j = 0; j < numSquares; j++) {
          row.push(createSquare(j, i))
        }
        grid.push(row)
      }
      return grid;
    }


    return {
      newGrid: newGrid
    }
  })
