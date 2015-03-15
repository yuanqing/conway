/* global Conway */
(function() {

  var REAL_WIDTH = 300;
  var REAL_HEIGHT = 300;
  var PIXEL = 10;
  var WIDTH = REAL_WIDTH / PIXEL;
  var HEIGHT = REAL_HEIGHT / PIXEL;
  var COLOURS = [
    [ '#ddd', '#eee' ],
    [ '#fe8', '#fd0' ]
  ];

  var canvas = document.querySelectorAll('canvas')[0];
  canvas.width = REAL_WIDTH;
  canvas.height = REAL_HEIGHT;

  var context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;

  var c = new Conway(WIDTH, HEIGHT);

  var draw = function(arr) {
    context.clearRect(0, 0, REAL_WIDTH, REAL_HEIGHT);
    var i = -1;
    while (++i < HEIGHT) {
      var j = -1;
      while (++j < WIDTH) {
        var state = arr[i][j];
        var colours = COLOURS[state - 1];
        if (state !== c.DEAD) {
          context.fillStyle = colours[Math.floor(colours.length * Math.random())];
          context.fillRect(j * PIXEL, i * PIXEL, PIXEL, PIXEL);
        }
      }
    }
  };

  var set = function(x, y) {
    var offset = canvas.getBoundingClientRect();
    x = Math.floor((x - offset.left) / PIXEL);
    y = Math.floor((y - offset.top) / PIXEL);
    c.set(x  , y-1);
    c.set(x-1, y  );
    c.set(x  , y  );
    c.set(x+1, y  );
    c.set(x  , y+1);
  };

  (function tick() {
    setTimeout(function() {
      draw(c.get());
      c.next();
      tick();
    }, 100);
  })();

  var isMouseDown = false;
  canvas.addEventListener('mousedown', function(e) {
    isMouseDown = true;
    set(e.pageX, e.pageY);
  });
  canvas.addEventListener('mouseup', function() {
    isMouseDown = false;
  });
  canvas.addEventListener('mousemove', function(e) {
    if (isMouseDown) {
      set(e.pageX, e.pageY);
    }
  });

})();
