document.addEventListener("DOMContentLoaded", function(event) {
  var foenix = (function() {
    var _base = {};
    var editFunc = [];
    _base.draw = function(v,bc,c,w,h,self) {
      if(v.paused || v.ended) return false;
      bc.drawImage(v,0,0,w,h);
      for(var i=0;i<editFunc.length;i++) {
        editFunc[i](v,bc,c,w,h);
      }
      self = this;
      setTimeout(_base.draw,15,v,bc,c,w,h,self);
    }
    _base.init = function(elem) {
      if(elem.length==1) {
        elem = elem[0];
      }
      this._c = document.createElement("canvas");
      this._bc = document.createElement("canvas");
      this._ctx = this._c.getContext('2d');
      this._bctx = this._bc.getContext('2d');
      this._e = elem;
      var self = this;
      elem.style.display = "none";
      this.redraw();
      return this;
    }
    _base.addClass = function(className) {
      if (this._c.classList)
        this._c.classList.add(className);
      else
        this._c.className += ' ' + className;
    }
    _base.fullscreen = function() {
      this._c.width = window.innerWidth;
      this._c.height = window.innerHeight;
      this._bc.width = window.innerWidth;
      this._bc.height = window.innerHeight;
      this.redraw();
      return this;
    }
    _base.greyscale = function() {
      var self = this;
      this._e.addEventListener('play', function(){
        var edit = function(v,bc,c,w,h) {
          var idata = bc.getImageData(0,0,w,h);
          var data = idata.data;
          for(var i = 0; i < data.length; i+=4) {
            var r = data[i];
            var g = data[i+1];
            var b = data[i+2];
            var brightness = (3*r+4*g+b)>>>3;
            data[i] = brightness;
            data[i+1] = brightness;
            data[i+2] = brightness;
          }
          idata.data = data;
          c.putImageData(idata,0,0);
        }
        editFunc.push(edit);
        self.draw(self._e, self._bctx, self._ctx,self._c.width,self._c.height,self);
      },false);
      return this;
    }
    _base.vignette = function() {
      var self = this;
      console.log(editFunc);
      this._e.addEventListener('play', function(){
        var edit = function(v,bc,c,w,h) {
          var grd = self._ctx.createRadialGradient(w/2, h/2, h, w/2, h/2, 0);
          c.drawImage(v,0,0,w,h);
          grd.addColorStop(1, 'transparent');
          grd.addColorStop(0, '#000');
          self._ctx.fillStyle = grd;
          self._ctx.fillRect(0,0,w,h);
        }
        editFunc.push(edit);
        self.draw(self._e, self._bctx, self._ctx,self._c.width,self._c.height,self);
      },false);
      return this;
    }
    _base.autoplay = function() {
      this._e.play();
    }
    _base.redraw = function() {
      document.body.appendChild(this._c);
      return this;
    }
    return _base;
  }());
foenix.init(document.getElementById("video")).fullscreen().greyscale().vignette().autoplay();
});