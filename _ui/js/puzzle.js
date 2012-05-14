app.Puzzle = (function(window, undefined) {
    var hasTouch = 'ontouchstart' in window,
        endEvent = hasTouch ? 'touchend' : 'mouseup';
      
    var Puzzle = function(options) {
        this.board = new app.Board({
            cssClass: "board",
            id: "board",
            image: options.image
        });
        document.querySelector(options.wrapper).appendChild(this.board.element);
        app.utils.event.fire("board:appended");
        this.initEvents();
        app.utils.addClass(this.board.element, "showing");
    };
    
    Puzzle.prototype.initEvents = function() {
        var that = this;
        document.getElementById("shuffle").addEventListener(endEvent, function() {
            that.board.shuffle();
        }, false);
    };
    return Puzzle;
})(window);