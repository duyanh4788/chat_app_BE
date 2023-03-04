"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("../routes");
class App {
    constructor() {
        this.mainRoutes = new routes_1.Routes();
        this.mongooseUrl = process.env.DATABASE;
        this.app = (0, express_1.default)();
        this.configCors();
        this.configJson();
        this.mongooSetup();
        this.mainRoutes.routes(this.app);
    }
    mongooSetup() {
        mongoose_1.default.Promise = global.Promise;
        mongoose_1.default
            .connect(this.mongooseUrl)
            .then(() => console.log('MongoDB connect success'))
            .catch(error => console.log(error));
        mongoose_1.default.connection;
    }
    configCors() {
        this.app.use((0, cors_1.default)({
            origin: process.env.END_POINT_HOME,
            methods: ['OPTIONS', 'GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
        }));
    }
    configJson() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map