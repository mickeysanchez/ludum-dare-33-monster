angular.module('monsterApp')
  .filter('rounded', function() {
    return function(input) {
      return Math.round(input * 100);
    }
  })
