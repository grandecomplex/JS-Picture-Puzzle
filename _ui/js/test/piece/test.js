var app = {};

window.addEventListener("load", function() {
    
    var piece = new app.Piece({
        width: 300,
        height: 500,
        id: 0,
        backgroundPosition: "0 0"
    });
        
    document.body.appendChild(piece.element);
    
    test("A piece should exist once created", function() {
        ok($("#piece0").length, "Piece exists");
    });
    
    test("A piece should have dimensions", function() {
        equals($("#piece0").height(), "500", "Piece has height");
        equals($("#piece0").width(), "300", "Piece has width");
    });
    
    test("piece should have a background position set from css", function() {
        ok($("#piece0").css("backgroundImage") !== "", "Has a background");
    });
    
    test("piece has css class name 'piece'", function() {
        ok($("#piece0").hasClass("piece"), "Has class name");
    });
});