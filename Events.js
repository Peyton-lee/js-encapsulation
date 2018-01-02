/**
 * Created by Peyton on 2017/12/29.
 */
;(function (exports) {

    /*
     sg.addEventListener(this);
     this.eventEmitter.on("event", function (a, b) {
     cc.log(a, b);
     });
     this.eventEmitter.emit("event", 1, 2);
     this.eventEmitter.once("event", 1, 2);
     */

    if (exports.addEventListener || exports.removeEventListener) {
        EventListener.prototype.error("addEventListener has been defined.");
        return;
    }

    // @param: {scope | binding context "this"}
    Object.defineProperty(exports, 'addEventListener', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (scope) {
            if (!!scope.eventEmitter) {
                EventListener.prototype.error("The event has been added after. Do not need to add again.");
                return;
            }
            scope.eventEmitter = new EventListener(scope);
        }
    });

    Object.defineProperty(exports, 'removeEventListener', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (scope) {
            if (!scope.eventEmitter) {
                EventListener.prototype.error("The event has been removed.");
                return;
            }
            scope.eventEmitter = null;
        }
    });

    // `EventListener` constructor
    function EventListener(scope) {
        this._target = scope;
        this._eventCaches = {};
    };

    // `EventListener` prototype
    EventListener.prototype = {
        constructor: EventListener,

        error: function (logText) {
            cc.log("[EVENTS ERROR]: " + logText);
        },

        // Get the array of all event names
        getEventNames: function () {
            var names = [];
            for (var key in this._eventCaches) {
                names.push(key);
            }
            return names;
        },

        // Binding event
        on: function (eventName, callback) {
            if (!eventName || typeof eventName !== "string") {
                this.error("check your first parameter.");
                return;
            }
            if (typeof callback !== "function") {
                this.error("The callback is not a function.");
                return;
            }
            if (this._eventCaches[eventName]) {
                this.error("The event [" + eventName + "] has already existed.");
                return;
            }
            this._eventCaches[eventName] = callback;
        },

        // Trigger binding event
        emit: function () {
            var eventName = arguments[0];
            if (!eventName || typeof eventName !== "string") {
                this.error("Check your incoming parameters.");
                return;
            }
            if (!this._eventCaches[eventName]) {
                this.error("The event [" + eventName + "] has not existed.");
                return;
            }
            // remove the first parameter
            var params = Array.prototype.slice.call(arguments, 1, arguments.length);
            this._eventCaches[eventName].apply(this._target, params);
        },

        // Trigger binding event is executed only once
        once: function () {
            this.emit.apply(this, arguments);
            var eventName = arguments[0];
            this._eventCaches[eventName] = null;
        },

        // Remove binding events by event name
        remove: function (eventName) {
            if (!eventName || typeof eventName !== "string") {
                this.error("The event [" + eventName + "] is not string.");
                return;
            }
            if (!this._eventCaches[eventName]) {
                this.error("The event [" + eventName + "] has been removed.");
                return;
            }
            this._eventCaches[eventName] = null;
        }
    }

})(sg || {});
