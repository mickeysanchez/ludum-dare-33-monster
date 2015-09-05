var MIN_POSSIBLE_PAYOFF = 0;
var MAX_POSSIBLE_PAYOFF = 1000;

angular.module('monsterApp')
  .factory('GridMaker', function() {

    var grid = [];

    function createSquare(x, y) {
      var type = createType(x, y);
      var name = createName(type);
      var maximumPayoff = determineMaxPayoff(type, x, y);
      var baseSuccessPercentage = determineSuccessPercentage(type, maximumPayoff, x, y);

      return {
        x: x,
        y: y,
        type: type,
        baseSuccessPercentage: baseSuccessPercentage,
        maximumPayoff: maximumPayoff,
        info: {
          name: name
        }
      }
    }

    function createType(x, y) {

      var squareTypes = ["Residential", "Commercial", "Road"];
      var type = "Residential";
      type = (_.random(0, 100) < 25) ? "Commercial" : type;
      if (x % 3 == 0 || y % 5 == 0) type = "Road";
      // type = (_.random(0, 100) < 50) ? "Road" : type;
      return type;
    }

    function determineSurrounding(numSquares) {
      for (var i = 0; i < numSquares + 1; i++) {
        for (var j = 0; j < numSquares; j++) {
          grid[i][j].surrounding = getSurrounding(i, j, numSquares)
        }
      }
    }

    function getSurrounding(y, x, numSquares) {
      var above = false,
        right = false,
        left = false,
        below = false;

      if (y > 0) {
        above = grid[y - 1][x].type
      }

      if (x < numSquares - 1) {
        right = grid[y][x + 1].type
      }

      if (x > 0) {
        left = grid[y][x - 1].type
      }

      if (y < numSquares) {
        below = grid[y + 1][x].type
      }

      return {
        above: above,
        right: right,
        left: left,
        below: below
      }
    }

    function createName(type) {
      if (type == "Residential") {
        return chance.last() + " Family"
      } else if (type == "Commercial") {
        var businessTypes = ["Convenience Store", "Gas Station", "Shoes", "Clothing", "Pawn Shop", "Grocery"]
        return chance.capitalize(chance.word()) + " " + _.sample(businessTypes);
      } else {
        return ""
      }
    }

    function determineMaxPayoff(type, x, y) {
      if (type == "Road") {
        return 0;
      } else {
        return _.random(MIN_POSSIBLE_PAYOFF, MAX_POSSIBLE_PAYOFF);
      }
    }

    var determineSuccessPercentage = function determineSuccessPercentage(type, maximumPayoff, x, y) {
      if (type == "Road") {
        return 0;
      } else {
        var percentPayoff = maximumPayoff / MAX_POSSIBLE_PAYOFF
        return 1 - percentPayoff;
      }
    }

    var newGrid = function(numSquares) {
      for (var i = 0; i < numSquares + 1; i++) {
        var row = []
        for (var j = 0; j < numSquares; j++) {
          row.push(createSquare(j, i))
        }
        grid.push(row)
      }

      determineSurrounding(numSquares);

      return grid;
    }


    return {
      newGrid: newGrid,
      determineSuccessPercentage: determineSuccessPercentage
    }
  })
