(function(fn) {
  /* istanbul ignore if  */
  if (typeof module === 'undefined') {
    this.Conway = fn();
  } else {
    module.exports = fn();
  }
})(function() {

  'use strict';

  var NEXT_STATE = [
    [ 0, 0, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 1, 0, 0, 0, 0, 0 ]
  ];

  var iterate = function(n, fn) {
    var i = -1;
    while (++i < n) {
      fn(i);
    }
  };

  var Conway = function(width, height, opts) {

    if (!(this instanceof Conway)) {
      return new Conway(width, height, opts);
    }

    opts = opts || {};
    var levels = (opts.levels || 3) - 1;
    var initial = opts.initial == null ? 0.5 : opts.initial;
    var spontaneous = opts.spontaneous || 0;

    var map = [];
    var neighbours = [];

    var init = function() {
      iterate(height, function(j) {
        map[j] = [];
        neighbours[j] = [];
        iterate(width, function(i) {
          map[j][i] = Math.random() < initial ? levels : 0;
          neighbours[j][i] = 0;
        });
      });
    };

    var getState = function(i, j) {
      return i > -1 && i < width && j > -1 && j < height &&
        map[j][i] === levels ? 1 : 0;
    };

    var updateNeighbours = function() {
      iterate(height, function(j) {
        iterate(width, function(i) {
          neighbours[j][i] = getState(i-1, j-1) +
                             getState(i-1, j  ) +
                             getState(i-1, j+1) +
                             getState(i  , j-1) +
                             getState(i  , j+1) +
                             getState(i+1, j-1) +
                             getState(i+1, j  ) +
                             getState(i+1, j+1);
        });
      });
    };

    this.init = init;

    this.set = function(i, j) {
      if (i > -1 && i < width && j > -1 && j < height) {
        map[j][i] = levels;
      }
    };

    this.get = function() {
      return map;
    };

    this.next = function() {
      updateNeighbours();
      iterate(height, function(j) {
        iterate(width, function(i) {
          var nextState = NEXT_STATE[getState(i, j)][neighbours[j][i]];
          if (nextState === 1) {
            map[j][i] = levels;
          } else {
            if (map[j][i] !== 0) {
              map[j][i]--;
            } else {
              if (spontaneous && Math.random() < spontaneous) {
                map[j][i] = levels;
              }
            }
          }
        });
      });
      return map;
    };

    this.DEAD = 0;
    this.ALIVE = levels;

    init();

  };

  return Conway;

});
