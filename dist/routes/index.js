"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const convertStation_routes_1 = require("./childRouter/convertStation.routes");
const message_routes_1 = require("./childRouter/message.routes");
const user_routes_1 = require("./childRouter/user.routes");
class Routes {
    constructor() {
        this.usersRoutes = new user_routes_1.UsersRoutes();
        this.messagesRoutes = new message_routes_1.MessagesRoutes();
        this.converStationRoutes = new convertStation_routes_1.ConverStationRoutes();
    }
    routes(app) {
        this.usersRoutes.routes(app);
        this.messagesRoutes.routes(app);
        this.converStationRoutes.routes(app);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=index.js.map