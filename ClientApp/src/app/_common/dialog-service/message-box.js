"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dialog_component_1 = require("../../dialog/dialog.component");
var MessageBox = /** @class */ (function () {
    function MessageBox() {
    }
    MessageBox.show = function (dialog, message, title, information, button, allow_outside_click, style, width) {
        if (title === void 0) { title = "Alert"; }
        if (information === void 0) { information = ""; }
        if (button === void 0) { button = 0; }
        if (allow_outside_click === void 0) { allow_outside_click = false; }
        if (style === void 0) { style = 0; }
        if (width === void 0) { width = "200px"; }
        var dialogRef = dialog.open(dialog_component_1.DialogComponent, {
            data: {
                title: title || "Alert",
                message: message,
                information: information,
                button: button || 0,
                style: style || 0,
                allow_outside_click: allow_outside_click || false
            },
            width: width, panelClass: 'custom-dialog-ovelay'
        });
        return dialogRef.afterClosed();
    };
    return MessageBox;
}());
exports.MessageBox = MessageBox;
var MessageBoxButton;
(function (MessageBoxButton) {
    MessageBoxButton[MessageBoxButton["Ok"] = 0] = "Ok";
    MessageBoxButton[MessageBoxButton["OkCancel"] = 1] = "OkCancel";
    MessageBoxButton[MessageBoxButton["YesNo"] = 2] = "YesNo";
    MessageBoxButton[MessageBoxButton["AcceptReject"] = 3] = "AcceptReject";
})(MessageBoxButton = exports.MessageBoxButton || (exports.MessageBoxButton = {}));
var MessageBoxStyle;
(function (MessageBoxStyle) {
    MessageBoxStyle[MessageBoxStyle["Simple"] = 0] = "Simple";
    MessageBoxStyle[MessageBoxStyle["Full"] = 1] = "Full";
})(MessageBoxStyle = exports.MessageBoxStyle || (exports.MessageBoxStyle = {}));
;
//# sourceMappingURL=message-box.js.map