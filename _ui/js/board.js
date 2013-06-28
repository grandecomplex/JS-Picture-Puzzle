app.Board = (function(window, undefined) {
    var hasTouch = 'ontouchstart' in window,
        resizeEvent, // Defined later because android doesn't always work with orientation change, so I need to know the platform.
        startEvent = hasTouch ? 'touchstart' : 'mousedown',
        moveEvent = hasTouch ? 'touchmove' : 'mousemove',
        endEvent = hasTouch ? 'touchend' : 'mouseup';
        
        
    // Board dimensions declared in the Board constructor
    var widthOfBoard,
        heightOfBoard,
        tileWidth,
        tileHeight;
    
    var boardOffset;
    
    var ANIMATE_CSS_CLASS = "animate",
        ACTIVE_PIECE_CSS_CLASS = "active";
        
    var convert = {
        arrayIndexToTransform: function (i) {
            var currentPosition = this.arrayIndexToBoardCoords(i);

            return {
                x: tileWidth*currentPosition.x,
                y: tileHeight*currentPosition.y
            };
        }, 

        clientCoordsToBoardCoords: function(x, y) {
            x -=  boardOffset.x;
            y -=  boardOffset.y;
            
            return {
                x: Math.floor(x / tileWidth),
                y: Math.floor(y / tileHeight)
            };
        },

        arrayIndexToBoardCoords: function(index) {
            return {
                x: index % 4, 
                y: Math.floor(index/4)
            };
        },
        
        boardCoordsToArrayIndex: function(point) {
            return (point.y * 4) + point.x;
        }
    };
    
    var setup = {
        pieces: function(board) {
            var pieces = [],
                id = 0,
                gridSize = 4*4,
                randomPiece = Math.floor(Math.random() * gridSize);
            
            for (var i = 0; i < gridSize; i++) {
                var transformCoords;
                var piece;
                
                if (i === randomPiece) {
                    piece = null;
                } else {
                    transformCoords = convert.arrayIndexToTransform(i);
                    
                    piece = new app.Piece({
                        width: tileWidth,
                        height: tileHeight,
                        backgroundSize: widthOfBoard,
                        id: i,
                        backgroundPosition: (-transformCoords.x)+"px "+(-transformCoords.y)+"px"
                    });
                    
                    translateByPosition(piece, transformCoords);
                    board.appendChild(piece.element);
                }
                pieces.push(piece);
            }
            
            return pieces;
        },

        board: function (options) {            
            var element = document.createElement("div");
            element.id = options.id;
            app.utils.addClass(element, options.cssClass);
            app.utils.addClass(element, ANIMATE_CSS_CLASS);
            element.style.width = widthOfBoard+"px";
            element.style.height = heightOfBoard+"px";
            
            return element;
        }
    };
    
    var translateByPosition = function(piece, position) {        
        app.utils.translate(position.x, position.y, piece.element);
    };
    
    var translateByIndex = function(piece, arrayIndex) {
        var transformCoords = convert.arrayIndexToTransform(arrayIndex);
        translateByPosition(piece, transformCoords);
    };
    
    var setPiecesTransform = function(pieces) {
        pieces.forEach(function(piece, i) {
            if (piece) {
                translateByIndex(piece, i);
            }
        });
    };
    
    var addActiveClass = function(pieces) {
        pieces.forEach(function(piece) {
            if (piece) {
                app.utils.addClass(piece.element, ACTIVE_PIECE_CSS_CLASS);
            }
        });
    };
    
    var removeActiveClass = function(pieces) {
        pieces.forEach(function(piece) {
            if (piece) {
                app.utils.removeClass(piece.element, ACTIVE_PIECE_CSS_CLASS);
            }
        });
    };
    
    var setBoardOffset = function(element) {
        // To wait for Mobile to finish orientation
        var timer = setTimeout(function() {
            boardOffset = {
                x: element.offsetLeft,
                y: element.offsetTop
            };             
        }, 100);
    };
    
    var getBoardInfoByEvent = function(e, pieces, getEmptyTileArrayIndex) {
        var isSameRow, 
            isSameColumn,
            triggeredBoardCoords,
            emptyTileBoardCoords,
            arrayIndex,
            emptyTileArrayIndex = getEmptyTileArrayIndex,
            point = hasTouch ? e.changedTouches[0] : e;
                
        triggeredBoardCoords = convert.clientCoordsToBoardCoords( point.pageX, point.pageY );
        emptyTileBoardCoords = convert.arrayIndexToBoardCoords( emptyTileArrayIndex );
        
        arrayIndex = convert.boardCoordsToArrayIndex( triggeredBoardCoords );
        
        isSameRow = triggeredBoardCoords.y === emptyTileBoardCoords.y;
        isSameColumn = triggeredBoardCoords.x === emptyTileBoardCoords.x;
      
        return {
            directionTriggeredRelativeToEmptyTile: {
                left: isSameRow && ( triggeredBoardCoords.x - emptyTileBoardCoords.x ) < 0,
                right: isSameRow && ( triggeredBoardCoords.x - emptyTileBoardCoords.x ) > 0,

                up: isSameColumn && ( arrayIndex - emptyTileArrayIndex ) < 0,
                down: isSameColumn && ( arrayIndex - emptyTileArrayIndex ) > 0,

                row: isSameRow,
                column: isSameColumn
            },
            
            rowDistance: triggeredBoardCoords.x - emptyTileBoardCoords.x,
            
            triggeredArrayIndex: arrayIndex
        };
    };
    
    
    /*
    
    Constructor
    
    */
    
    var Board = function(options) {
        var clientDimensions = app.utils.getClientDimensions();
        
        widthOfBoard = options.width || ( (clientDimensions.x > 500) ? 500 : clientDimensions.x );
        heightOfBoard = options.height || widthOfBoard; // because it is a square
        tileWidth = (widthOfBoard/4);
        tileHeight = (heightOfBoard/4);
        
        resizeEvent = ( ( 'onorientationchange' in window ) && app.platform !== "android")  ? 'orientationchange' : 'resize';
        
        this.element = setup.board(options);
        this.pieces = setup.pieces(this.element);
        
        this.initEvents();
    };
    
    Board.prototype.getEmptyTileArrayIndex = function() {
        var pieces = this.pieces;
        for (var i = 0, piecesLength = pieces.length; i < piecesLength; i++) {
            if (!pieces[i]) {
                return i;
            }
        }
    };

    Board.prototype.shuffle = function() {
        var pieces = this.pieces = app.utils.shuffleArray(this.pieces);
        pieces.forEach(function(piece, i) {
            if (piece) {
                translateByIndex(piece, i);
            }
        });
    };

    Board.prototype.initEvents = function() {
        var that = this;
        
        this.element.addEventListener(startEvent, this, false);
        window.addEventListener(resizeEvent, this, false);
        
        app.utils.event.subscribe("board:appended", function() {
            setBoardOffset(that.element);
        });
    };
        
    Board.prototype.handleEvent = function(e) {
        switch (e.type) {
            case startEvent:
                this.startEvent(e);
                break;
            case moveEvent:
                this.moveEvent(e);
                break;
            case endEvent:
                this.endEvent(e);
                break;
            case resizeEvent:
                this.resizeBoard();
                break;
        }
    };

    Board.prototype.getPiecesToMove = function() {
        var direction = this.boardInfo.directionTriggeredRelativeToEmptyTile,
            rowDistance = this.boardInfo.rowDistance,
            arrayIndex = this.boardInfo.triggeredArrayIndex,
            emptyPieceIndex = this.getEmptyTileArrayIndex(),
            piecesToMoveArray = [],
            column = emptyPieceIndex % 4;
            
        if (direction.left) {
            for (var leftIndex = rowDistance+1; 0 >= leftIndex; leftIndex++) {
                piecesToMoveArray.unshift(this.pieces[arrayIndex-leftIndex]);
            }
        } else if (direction.right) {
            for (var rightIndex = rowDistance-1; 0 <= rightIndex; rightIndex--) {
                piecesToMoveArray.unshift(this.pieces[arrayIndex-rightIndex]);
            }
        } else if (direction.up) {
            for (var aboveIndex = emptyPieceIndex-1; arrayIndex <= aboveIndex; aboveIndex--) {
                if (aboveIndex % 4 === column) {
                    piecesToMoveArray.unshift(this.pieces[aboveIndex]);
                }                        
            }
        } else if (direction.down) {
            for (var belowIndex = emptyPieceIndex+1; arrayIndex >= belowIndex; belowIndex++) {
                if (belowIndex % 4 === column) {
                    piecesToMoveArray.unshift(this.pieces[belowIndex]);
                }
            }             
        }
        
        return piecesToMoveArray;
    };

    Board.prototype.startEvent = function(e) {
        var isSameRow, isSameColumn, that = this;
                
        var point = hasTouch ? e.changedTouches[0] : e;
                
        this.startingPoint = {
            pageX: point.pageX,
            pageY: point.pageY
        };
        
        this.boardInfo = getBoardInfoByEvent(e, this.pieces, this.getEmptyTileArrayIndex());
        
        // Due to piece confusion when finger/mouse leaves the board while touching/dragging.
        setPiecesTransform(this.pieces);
        
        isSameRow = this.boardInfo.directionTriggeredRelativeToEmptyTile.row;
        isSameColumn = this.boardInfo.directionTriggeredRelativeToEmptyTile.column;
        if (isSameRow || isSameColumn) {
            this.element.addEventListener(moveEvent, this, false);
            this.element.addEventListener(endEvent, this, false);
        }
        
        this.curTransform = convert.arrayIndexToTransform(this.boardInfo.triggeredArrayIndex);
        
        this.piecesToMove = this.getPiecesToMove();
        
        addActiveClass(this.piecesToMove);
    }; 

    Board.prototype.moveEvent = function(e) {
        var that = this,
            point = hasTouch ? e.changedTouches[0] : e,
            direction = this.boardInfo.directionTriggeredRelativeToEmptyTile,
            piecesToMove = this.piecesToMove,
            shouldMove = true,
            currentTile = this.pieces[this.boardInfo.triggeredArrayIndex];
            
        app.utils.removeClass(this.element, ANIMATE_CSS_CLASS);
        e.preventDefault();
        
        if (piecesToMove.length) {
            piecesToMove.forEach(function(piece, i) {
                var modifier, deltaX = 0, deltaY = 0;
                if (direction.row){
                    modifier = direction.left ? (tileWidth*i) : -(tileWidth*i);
                    deltaX = (point.pageX - that.startingPoint.pageX) + modifier;
                } else {
                    modifier = direction.up ? (tileHeight*i) : -(tileHeight*i);
                    deltaY = (point.pageY - that.startingPoint.pageY) + modifier;
                }
                app.utils.translate(deltaX, deltaY, piece.element, that.curTransform);                
 
             });
        }
        
        this.lastPoint = point;
    };

    
    Board.prototype.endEvent = function(e) {
        var movedMostOfTheWay, 
            didntMoveAtAll, 
            point = this.lastPoint || this.startingPoint,
            direction = this.boardInfo.directionTriggeredRelativeToEmptyTile;
            
        removeActiveClass(this.piecesToMove);
        
        app.utils.removeClass(this.element, ANIMATE_CSS_CLASS);
                
        if (direction.left || direction.up) {
            movedMostOfTheWay = point.pageX - this.startingPoint.pageX > (tileWidth/2) || 
                point.pageY - this.startingPoint.pageY > (tileWidth/2);
        } else {
            movedMostOfTheWay = this.startingPoint.pageX - point.pageX > (tileWidth/2) || 
                this.startingPoint.pageY - point.pageY > (tileWidth/2);
        }

        didntMoveAtAll = (this.boardInfo.directionTriggeredRelativeToEmptyTile.row) ? 
            (point.pageX - this.startingPoint.pageX) === 0 : 
            (point.pageY - this.startingPoint.pageY) === 0;
        
        if (movedMostOfTheWay || didntMoveAtAll) {
            this.movePieces();
        } else {
            setPiecesTransform(this.pieces);
            
        }

        this.element.removeEventListener(moveEvent, this, false);
        this.element.removeEventListener(endEvent, this, false);
                        
        this.lastPoint = null;
        
        app.utils.addClass(this.element, ANIMATE_CSS_CLASS);
    };
    
    Board.prototype.resizeBoard = function() {
        var that = this;
        var timer = 0;
        setBoardOffset(this.element);
        app.utils.removeClass(this.element, ANIMATE_CSS_CLASS);
        
        // xxx don't repeat this getclient code from up above - DRY
        var clientWidth = (app.utils.getClientDimensions().x > 500) ? 500 : app.utils.getClientDimensions().x;
        tileWidth = clientWidth / 4;
        tileHeight = clientWidth / 4;
        
        this.element.style.width=clientWidth+"px";
        this.element.style.height=clientWidth+"px";
        
        this.pieces.forEach(function(piece, i) {
            var transformCoords;
            var styles = {};
            
            if (piece) {
                transformCoords = convert.arrayIndexToTransform(piece.id);
                
                styles = {
                    height: tileHeight,
                    width: tileWidth,
                    backgroundSize: clientWidth,
                    backgroundPosition: (-transformCoords.x)+"px "+(-transformCoords.y)+"px"
                };
                that.pieces[i].ui(styles);
                
               translateByIndex(piece, i);
            }
        });
        
        // To wait for the resize to finish
        timer = setTimeout(function() {
            app.utils.addClass(that.element, ANIMATE_CSS_CLASS);
        }, 100);
        
    };
    
    Board.prototype.movePieces = function() {
        var direction = this.boardInfo.directionTriggeredRelativeToEmptyTile,
            arrayIndex = this.boardInfo.triggeredArrayIndex,
            piecesToMove = this.piecesToMove,
            that = this;

        piecesToMove.forEach(function(piece, i) {
            if (direction.left) {
                that.pieces[arrayIndex+1+i] = piece;
            }
            else if (direction.right) {
                that.pieces[arrayIndex-1-i] = piece;
            }        
            else if (direction.up) {
                that.pieces[arrayIndex+4+(i*4)] = piece;
            }        
            else if (direction.down) {
                that.pieces[arrayIndex-4-(i*4)] = piece;
            }
        });
        
        if (direction.row || direction.column) {
            this.pieces[arrayIndex] = null;
        }
        
        setPiecesTransform(this.pieces);
    };
    
    return Board;
})(window);