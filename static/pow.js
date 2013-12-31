/*
Copyright (c) 2012 Greg Reimer ( http://obadger.com/ )

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

(function(w, d, $){

  // defaults
  var defaultArgs = {
    rays: 16,
    originX: '50%',
    originY: '50%',
    bgColorStart: 'rgba(0,0,0,0.1)',
    bgColorEnd: 'rgba(0,0,0,0.2)',
    rayColorStart: 'hsla(0,0%,100%,0.2)',
    rayColorEnd: 'hsla(0,0%,100%,0.3)',
    sizingRatio: 1
  };

  $.fn.pow = (function(){
    return function(args){

      // bail if none
      if (this.length === 0) { return; }
      // set defaults
      args = $.extend({}, defaultArgs, args);

      // set vars and grab a few values to use later
      var $el = this.eq(0);
      var width = $el.outerWidth();
      var height = $el.outerHeight();
      var offset = $el.offset();
      var originX = (parseFloat(args.originX) || 0) / 100;
      var originY = (parseFloat(args.originY) || 0) / 100;

      // center rays on a given element
      if (args.originEl) {
        var $oel = $(args.originEl);
        if ($oel.length) {
          var oOffset = $oel.offset();
          var oWidth = $oel.outerWidth();
          var oHeight = $oel.outerHeight();
          originX = (((oOffset.left - offset.left) + (oWidth / 2)) / width);
          originY = (((oOffset.top - offset.top) + (oHeight / 2)) / height);
        }
      }

      // convert to absolute lengths
      originX = width * originX;
      originY = height * originY;

      // find maximum distance to a corner
      var radius = Math.max.apply(Math, [
        {x:0,y:0},
        {x:width,y:0},
        {x:0,y:height},
        {x:width,y:height}
      ].map(function(c){
        // use the pythagorean theorem, luke
        return Math.sqrt(Math.pow(c.x - originX, 2) + Math.pow(c.y - originY, 2));
      }));

      try{
        var canvas = $('<canvas width="'+width+'" height="'+height+'" style="position:fixed;top:-999999px"></canvas>').appendTo(d.body).get(0);
        var ctx = canvas.getContext('2d');
      } catch(err) {
        return;
      }

      // build the background gradient
      var bgGrad = ctx.createRadialGradient(
        originX, originY, 0, // inner circle, infinitely small
        originX, originY, radius // outer circle, will just cover canvas area
      );
      bgGrad.addColorStop(0, args.bgColorStart);
      bgGrad.addColorStop(1, args.bgColorEnd);

      // build the foreground gradient
      var rayGrad = ctx.createRadialGradient(
        originX, originY, 0, // inner circle, infinitely small
        originX, originY, radius // outer circle, will just cover canvas area
      );
      rayGrad.addColorStop(0, args.rayColorStart);
      rayGrad.addColorStop(1, args.rayColorEnd);

      // fill in bg
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0,0,width,height);

      // draw rays
      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      var spokeCount = args.rays * 2;
      ctx.moveTo(originX, originY);  
      for (var i=0; i<args.rays; i++){
        for (var j=0; j<2; j++) {
          var thisSpoke = i * 2 + j;
          var traversal = thisSpoke / spokeCount;
          var ax = originX + radius * 1.5 * Math.cos(traversal * 2 * Math.PI);
          var ay = originY + radius * 1.5 * Math.sin(traversal * 2 * Math.PI);
          ctx.lineTo(ax,ay);
        }
        ctx.lineTo(originX, originY);  
      }
      ctx.fill();

      // set the data as css to the element
      var data = canvas.toDataURL("image/png");
      $(canvas).remove();
      $el.css({
        'background-image':'url("'+data+'")',
        'background-repeat':'no-repeat',
        'background-position':'50% 50%',
        'background-size':'cover'
      });
    };

  })();
})(window, document, jQuery);
