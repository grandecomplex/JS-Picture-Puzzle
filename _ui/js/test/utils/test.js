var app = {};

window.addEventListener("load", function() {
    app.utils = new app.Utils();

    var event =  app.utils.event;

    asyncTest("Firing a custom event should be consumed", function() {
        event.subscribe("firingEvent", function() {
            ok(true, "event was fired");
            start();
        });

        event.fire("firingEvent");
    });

    asyncTest("Custom events should pass data", function() {
        event.subscribe("firingEventWithData", function(data) {
            equals(data, "hello", "event was fired with data");
            start();
        });

        event.fire("firingEventWithData", "hello");
    });
    
    test("Utils should provide browser dimensions", function() {
        equals(app.utils.getClientDimensions().x, window.innerWidth, "Width is correct");
        equals(app.utils.getClientDimensions().y, window.innerHeight, "Height is correct");
    });
    
    test("Utils should add class", function() {
        app.utils.addClass(document.body, "cool");
        equals(document.body.className, "cool", "Properly added class of cool");
    });
    
    test("Utils should remove class", function() {
        app.utils.removeClass(document.body, "cool");
        equals(document.body.className, "", "Properly removed class of cool");
    });
});