"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConverStationRoutes = void 0;
const convertStation_controller_1 = require("../../controllers/convertStation.controller");
const converStation_middleware_1 = require("../../middlewares/messages/converStation.middleware");
class ConverStationRoutes {
    constructor() {
        this.converStationController = new convertStation_controller_1.ConverStationController();
        this.converStationMiddleware = new converStation_middleware_1.ConverStationMiddleware();
    }
    routes(app) {
        app
            .route('/api/v1/saveConvertStation')
            .post(this.converStationMiddleware.checkEmptyId, this.converStationMiddleware.getConverStationByUserId, this.converStationController.saveConverStation);
    }
}
exports.ConverStationRoutes = ConverStationRoutes;
//# sourceMappingURL=convertStation.routes.js.map