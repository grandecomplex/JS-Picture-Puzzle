window.addEventListener("load", function() {

    test("Board should contain a bunch of pieces", function() {
        ok($("#board").find(".piece").length > 0, "There are pieces");
    });

    test("Board should be shuffled into random order", function() {
        app.puzzle.board.shuffle();
        
        var pieces = app.puzzle.board.pieces;

        function checkOrder() {
            var willSucceed = false;
            
            for (var i = 0; i < pieces.length; i++) {
                
                if (pieces[i] && ( pieces[i].id !== i ) ) {
                    willSucceed = true;
                    return willSucceed;
                }
            }
            
            return willSucceed;
        }
        
        function checkTransforms() {
            function arrayIndexToTransform(i) {
                var currentPosition = this.arrayIndexToBoardCoordinates(i);

                return {
                    x: 125*currentPosition.x,
                    y: 125*currentPosition.y
                };
            }
            
            var willSucceed = false;
            
            for (var i = 0; i < pieces.length; i++) {
                if (pieces[i] && ( pieces[i].element.style.webkitTransform !== "translate("+arrayIndexToTransform.x+"px"+", "+arrayIndexToTransform.y+"px)" ) ) {
                    willSucceed = true;
                    return willSucceed;
                }
                
            }
            return willSucceed;            
        }
    
        ok(checkOrder(), "Board's model array is shuffled");
        
        ok(checkTransforms(), "Board's visual order is shuffled");
    });
    
    

});