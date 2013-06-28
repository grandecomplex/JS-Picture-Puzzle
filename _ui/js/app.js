window.app = {};

window.addEventListener("load", function() {
    app.utils = new app.Utils();
    
    app.platform = app.utils.setPlatform();
    
    app.puzzle = new app.Puzzle({
        image: "_ui/img/image.jpg",
        wrapper: "#board-wrapper"
    });
});

