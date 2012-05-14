app.Utils = (function(window) {
    var Utils = function() {};
    
    Utils.prototype.event = {
        eventMap: {},
        fire: function (eventName, data) {
            if (typeof this.eventMap[eventName] === "function") {
                this.eventMap[eventName](data);
            }
        },
        subscribe: function (eventName, fn, replace) {
            if (typeof this.eventMap[eventName] === "undefined" || replace) {
                this.eventMap[eventName] = fn;
            } else {
                var oldFunction = this.eventMap[eventName];
                this.eventMap[eventName] = function (data) {
                    if(typeof data !== "undefined") {
                        oldFunction(data);
                        fn(data);
                    } else {
                        oldFunction();
                        fn();
                    }
                };
            }
        }
    };

    Utils.prototype.getClientDimensions = function() {
        return {
            x: window.innerWidth, 
            y: window.innerHeight
        };
    };
    
    Utils.prototype.addClass = function(el, classname) {
        var existingClasses = el.className;
        
        if ( existingClasses.indexOf(classname) === -1 ) {
            el.className = ( existingClasses + " " + classname ).trim();
        }
        
        return el;
    };
    
    Utils.prototype.removeClass = function(el, classname) {
        var existingClasses = el.className;
        
        el.className = existingClasses.replace(classname, "").trim();
        
        return el;
    };
    
    Utils.prototype.translate = function(toX, toY, el, currentTransform) {
        currentTransform = currentTransform || {};
        var currentX = currentTransform.x || 0;
        var currentY = currentTransform.y || 0;
        el.style.webkitTransform = "translate("+Math.ceil(currentX+toX)+"px, "+Math.ceil(currentY+toY)+"px)";
    };
    
    //  from Underscore.js
    // http://documentcloud.github.com/underscore/underscore.js
    Utils.prototype.shuffleArray = function(obj) {
        var shuffled = [], rand;
        obj.forEach(function(value, index) {
          if (index === 0) {
            shuffled[0] = value;
          } else {
            rand = Math.floor(Math.random() * (index + 1));
            shuffled[index] = shuffled[rand];
            shuffled[rand] = value;
          }
        });
        return shuffled;
    };
    
    Utils.prototype.setPlatform = function() {        
        ["Safari", "Chrome", "Android", "iPhone", "Blackberry"].forEach(function(browser) {
            if (navigator.userAgent.indexOf(browser) > -1) {
                browser = browser.toLowerCase();
                if (browser === "safari" || browser === "chrome") {
                    platform = "desktop";
                } else {
                    platform = browser.toLowerCase();
                }   
            }
        });

        document.body.setAttribute("data-platform", platform);
        
        return platform;
    };
    
    return Utils;
    
})(window, undefined);