var MIN_POSSIBLE_PAYOFF = 0;
var MAX_POSSIBLE_PAYOFF = 1500;

angular.module('monsterApp')
  .factory('GridMaker', function() {

    var grid = [];

    function createSquare(x, y) {
      var type = createType(x, y);
      var subtype = createSubType(type);
      var thumbnail = 'assets/images/' + assignThumbnail(type, subtype);
      var name = createName(type, subtype);
      var maximumPayoff = determineMaxPayoff(type, x, y);
      var baseSuccessPercentage = determineSuccessPercentage(type, maximumPayoff, x, y);
      var jobSuccessPercentage = determineJobSuccess(baseSuccessPercentage);
      var jobPay = determineJobPay(jobSuccessPercentage);

      return {
        x: x,
        y: y,
        type: type,
        subtype: subtype,
        thumbnail: thumbnail,
        baseSuccessPercentage: baseSuccessPercentage,
        jobSuccessPercentage: jobSuccessPercentage,
        jobPay: jobPay,
        maximumPayoff: maximumPayoff,
        info: {
          name: name
        }
      }
    }

    function createType(x, y) {

      var squareTypes = ["Residential", "Commercial", "Park", "Road"];
      var type = "Residential";
      type = (_.random(0, 100) < 25) ? "Commercial" : type;
      type = (_.random(0, 100) < 5) ? "Park" : type;
      if (x % 3 == 0 || y % 5 == 0) type = "Road";
      // type = (_.random(0, 100) < 50) ? "Road" : type;
      return type;
    }

    function createSubType(type) {
      var businessTypes = ["Convenience Store", "Gas Station", "Shoes", "Clothing", "Pawn Shop", "Bank"]

      if (type == "Commercial") {
        return _.sample(businessTypes);
      } else {
        return ""
      }
    }

    function assignThumbnail(type, subtype) {
      if (type == "Residential") {
        return "house.png"
      } else if (type == "Commercial") {
        return {
          "Convenience Store": "convenience-store.png",
          "Gas Station": "gas-station.png",
          "Shoes": "clothing-store.png",
          "Clothing": "clothing-store.png",
          "Pawn Shop": "pawn-shop.png",
          "Bank": "bank.png"
        }[subtype]
      } else if (type == "Road") {
        return "road-horizontal.png"
      } else if (type == "Park") {
        return "park.png"
      }
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

    function createName(type, subtype) {
      if (type == "Residential") {
        return chance.last() + " Family"
      } else if (type == "Commercial") {
        return chance.capitalize(chance.word()) + " " + subtype;
      } else {
        return ""
      }
    }

    function determineMaxPayoff(type, x, y) {
      // if (type == "Road") {
      //   return 0;
      // } else {
      return _.random(MIN_POSSIBLE_PAYOFF, MAX_POSSIBLE_PAYOFF);
      // }
    }

    var determineSuccessPercentage = function determineSuccessPercentage(type, maximumPayoff, x, y) {
      // if (type == "Road") {
      //   return 0;
      // } else {
      var percentPayoff = maximumPayoff / MAX_POSSIBLE_PAYOFF
      return 1 - percentPayoff;
      // }
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

    var determineJobSuccess = function(baseSuccessPercentage) {
      return baseSuccessPercentage / 10;
    }

    var determineJobPay = function(jobSuccessPercentage) {
      var pay = 100 * jobSuccessPercentage + _.random(0, 10);
      pay = (pay < 8) ? 8 : pay;
      pay = (pay > 20) ? 20 : pay;
      return pay;
    }


    return {
      newGrid: newGrid,
      determineSuccessPercentage: determineSuccessPercentage
    }
  })
