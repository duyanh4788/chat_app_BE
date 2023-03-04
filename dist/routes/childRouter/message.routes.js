"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesRoutes = void 0;
const message_controller_1 = require("../../controllers/message.controller");
const message_middleware_1 = require("../../middlewares/messages/message.middleware");
class MessagesRoutes {
    constructor() {
        this.messagesControler = new message_controller_1.MessageControler();
        this.messagesMiddleware = new message_middleware_1.MessagesMiddleware();
    }
    routes(app) {
        app
            .route('/api/v1/getListMessages')
            .post(this.messagesMiddleware.checkConvertStationId, this.messagesControler.getListMessages);
        app
            .route('/api/v1/newMessage')
            .post(this.messagesMiddleware.checkUserId, this.messagesControler.postNewMessages);
    }
}
exports.MessagesRoutes = MessagesRoutes;
//# sourceMappingURL=message.routes.js.map