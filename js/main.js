/**
 * Created by davelin on 16/4/8.
 */


//1.js的分层(功能) : jquery(tools)  组件(ui)  应用(app), mvc(backboneJs)
//2.js的规划(管理) : 避免全局变量和方法(命名空间，闭包，面向对象) , 模块化(seaJs,requireJs)

window.onload = function(){
  mv.app.toTip();
  mv.app.toBanner();
  mv.app.toSortList();
  mv.app.toRun();
};

var mv = {};

mv.tools = {};
mv.ui = {};
mv.app = {};

mv.tools.getByClass = function(oParent, sClass) {
  var aEle = oParent.getElementsByTagName('*');
  var arr = [];

  for (var i = 0; i < aEle.length; i++) {
    if (aEle[i].className === sClass) {
      arr.push(aEle[i]);
    }
  }

  return arr;
};

mv.tools.getStyle = function(obj, attr) {
  if (obj.currentStyle) {
    return obj.currentStyle[attr];
  } else {
    return getComputedStyle(obj, false)[attr];
  }
};

mv.ui.textChange = function(obj, str) {
  obj.onfocus = function() {
    if (this.value === str) {
      this.value = '';
    }
  };

  obj.onblur = function() {
    if (this.value === '') {
      this.value = str;
    }
  };
};

mv.ui.fadeIn = function(obj) {
  var iCur = mv.tools.getStyle(obj, 'opacity');

  if(iCur == 1) {
    return false;
  }

  var value = 0;

  clearInterval(obj.timer);

  obj.timer = setInterval(function() {
    var iSpeed = 5;

    if(value == 100) {
      clearInterval(obj.timer);
    } else {
      value += iSpeed;
      obj.style.opacity = value / 100;
      obj.style.filter = 'alpha(opacity=' + value + ')';
    }
  }, 30);
};

mv.ui.fadeOut = function(obj) {
  var iCur = mv.tools.getStyle(obj, 'opacity');

  if(iCur == 0) {
    return false;
  }

  var value = 100;

  clearInterval(obj.timer);

  obj.timer = setInterval(function() {
    var iSpeed = -5;
    if(value == 0) {
      clearInterval(obj.timer);
    } else {
      value += iSpeed;
      obj.style.opacity = value/100;
      obj.style.filter = 'alpha(opacity=' + value + ')';
    }
  }, 30);
};

mv.ui.moveLeft = function(obj, old, now) {
  clearInterval(obj.timer);

  obj.timer = setInterval(function() {
    var iSpeed = (now - old) / 10;

    iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

    if(now == old) {
      clearInterval(obj.timer);
    } else {
      old += iSpeed;
      obj.style.left = old + 'px';
    }
  }, 30);
};

mv.app.toTip = function() {
  var oText1 = document.getElementById('text1');
  var oText2 = document.getElementById('text2');

  mv.ui.textChange(oText1, 'Search website');
  mv.ui.textChange(oText2, 'Search website');
};

mv.app.toBanner = function() {
  var oAd = document.getElementById('ad');
  var aLi = oAd.getElementsByTagName('li');

  var oPrevBg = mv.tools.getByClass(oAd, 'prev_bg')[0];
  var oNextBg = mv.tools.getByClass(oAd, 'next_bg')[0];

  var oPrev = mv.tools.getByClass(oAd, 'prev')[0];
  var oNext = mv.tools.getByClass(oAd, 'next')[0];

  var iNow = 0;
  var timer = setInterval(auoNext, 3000);

  function auoNext() {
    if(iNow == aLi.length - 1) {
      iNow = 0;
    } else {
      iNow++;
    }

    for(var i = 0; i < aLi.length; i++) {
      mv.ui.fadeOut(aLi[i]);
    }

    mv.ui.fadeIn(aLi[iNow]);
  }

  function autoPrev() {
    if(iNow == 0) {
      iNow = aLi.length - 1;
    } else {
      iNow--;
    }

    for(var i = 0; i < aLi.length; i++) {
      mv.ui.fadeOut(aLi[i]);
    }

    mv.ui.fadeIn(aLi[iNow]);
  }

  oPrevBg.onmouseover = oPrev.onmouseover = function() {
    oPrev.style.display = 'block';
    clearInterval(timer);
  };

  oNextBg.onmouseover = oNext.onmouseover = function() {
    oNext.style.display = 'block';
    clearInterval(timer);
  };

  oPrevBg.onmouseout = oPrev.onmouseout = function() {
    oPrev.style.display = 'none';
    timer = setInterval(auoNext, 3000);
  };

  oNextBg.onmouseout = oNext.onmouseout = function() {
    oNext.style.display = 'none';
    timer = setInterval(auoNext, 3000);
  };

  oPrev.onclick = function() {
    autoPrev();
  };

  oNext.onclick = function() {
    auoNext();
  };

};

mv.app.toSortList = function() {
  var oSortList = document.getElementById('sort_list');
  var aDd = oSortList.getElementsByTagName('dd');
  var aUl = oSortList.getElementsByTagName('ul');
  var aH2 = oSortList.getElementsByTagName('h2');

  for(var i = 0; i < aDd.length; i++) {
    aDd[i].index = i;

    aDd[i].onclick = function(ev) {
      var oEvent = ev || window.event;
      var _this = this;

      for(var i = 0; i < aUl.length; i++) {
        aUl[i].style.display = 'none';
      }

      aUl[this.index].style.display = 'block';

      document.onclick = function() {
        aUl[_this.index].style.display = 'none';
      };

      oEvent.cancelBubble = true;
    };
  }

  for(var i = 0; i < aUl.length; i++) {
    aUl[i].index = i;

    (function(ul) {
      var aLi = ul.getElementsByTagName('li');

      for(var i = 0; i < aLi.length; i++) {
        aLi[i].onmouseover = function() {
          this.className = 'active';
        };

        aLi[i].onmouseout = function() {
          this.className = '';
        };

        aLi[i].onclick = function(ev) {
          var oEvent = ev || window.event;

          aH2[this.parentNode.index].innerHTML = this.innerHTML;
          oEvent.cancelBubble = true;
          this.parentNode.style.display = 'none';
        };
      }
    })(aUl[i]);
  }
};

mv.app.toRun = function() {
  var oRun = document.getElementById('run1');
  var oUl = oRun.getElementsByTagName('ul')[0];
  var aLi = oUl.getElementsByTagName('li');

  var oPrev = mv.tools.getByClass(oRun, 'prev')[0];
  var oNext = mv.tools.getByClass(oRun, 'next')[0];
  var iNow = 0;

  oUl.innerHTML += oUl.innerHTML;
  oUl.style.width = aLi.length * aLi[0].offsetWidth + 'px';

  oPrev.onclick = function() {
    if(iNow == 0) {
      iNow = aLi.length / 2;
      oUl.style.left = -oUl.offsetWidth / 2 + 'px';
    }

    mv.ui.moveLeft(oUl, -iNow * aLi[0].offsetWidth, -(iNow - 1) * aLi[0].offsetWidth);
    iNow--;
  };

  oNext.onclick = function() {
    if(iNow == aLi.length/2) {
      iNow = 0;
      oUl.style.left = 0;
    }

    mv.ui.moveLeft(oUl, -iNow * aLi[0].offsetWidth, -(iNow + 1) * aLi[0].offsetWidth);
    iNow++;
  };
};
