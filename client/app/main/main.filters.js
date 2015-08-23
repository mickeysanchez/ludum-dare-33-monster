angular.module('monsterApp')
  .filter('rounded', function() {
    return function(input) {
      return Math.round(input * 100);
    }
  })
  .filter('abs', function() {
    return function(input) {
      return Math.abs(input);
    }
  })
