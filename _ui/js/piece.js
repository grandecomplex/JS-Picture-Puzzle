app.Piece = (function(window, undefined) {
    
    var ID_NAMESPACE = "piece";

    var Piece = function(options) {
        var pieceID = ID_NAMESPACE+options.id;
            
        options.height = options.height || 50;
        options.width = options.width || 50;
        options.backgroundPosition = options.backgroundPosition || "0 0";
        options.cssClass = options.cssClass || ID_NAMESPACE;
        options.backgroundSize = options.backgroundSize || "50";
        
        this.element = document.createElement("div");
        
        app.utils.addClass(this.element, options.cssClass);
        this.id = options.id;
        this.element.id = pieceID;
        
        this.ui(options);
    };
    
    Piece.prototype.ui = function(styles) {
        this.element.style.backgroundPosition = styles.backgroundPosition;
        this.element.style.width = styles.width+"px";
        this.element.style.height = styles.height+"px";
        this.element.style.backgroundSize = styles.backgroundSize+"px "+styles.backgroundSize+"px";
        this.element.style.backgroundPosition = styles.backgroundPosition;
    };
    
    return Piece;
})(window);