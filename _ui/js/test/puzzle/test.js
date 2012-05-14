window.addEventListener("load", function() {
    test("Puzzle should include a board", function() {
        ok($("#board").length, "Board exists");
    });
});

