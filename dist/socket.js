"use strict";
if (typeof WebSocket === 'undefined') {
    WebSocket = require('ws');
}
var Rx_1 = require("rxjs/Rx");
var RxWebSocket = (function () {
    function RxWebSocket(addr, protocols) {
        var _this = this;
        this._outgoing$ = new Rx_1.Subject();
        this._incoming$ = new Rx_1.Subject();
        this.serialize = function (data) { return JSON.stringify(data); };
        this.deserialize = function (data) { return JSON.parse(data); };
        this.socket = new WebSocket(addr, protocols);
        this.socket.onmessage = function (evt) { return _this.receive(evt); };
        this.socket.onerror = function (evt) { return _this.error(evt); };
        this.socket.onclose = function (evt) { return _this.close(evt); };
        this._outgoing$.map(function (data) { return _this.serialize(data); }).subscribe(function (msg) { return _this.send(msg); }, function (err) { return console.log("Error in outgoing data", err); }, function () { return _this.socket.close(); });
    }
    RxWebSocket.prototype.receive = function (evt) {
        var deserialized = this.deserialize(evt.data);
        this._incoming$.next(deserialized);
    };
    RxWebSocket.prototype.error = function (evt) {
        this._incoming$.error(evt);
    };
    RxWebSocket.prototype.close = function (evt) {
        this._incoming$.complete();
    };
    RxWebSocket.prototype.send = function (message) {
        this.socket.send(message);
    };
    Object.defineProperty(RxWebSocket.prototype, "incoming", {
        get: function () {
            return this._incoming$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxWebSocket.prototype, "outgoing", {
        get: function () {
            return this._outgoing$;
        },
        enumerable: true,
        configurable: true
    });
    return RxWebSocket;
}());
exports.RxWebSocket = RxWebSocket;
