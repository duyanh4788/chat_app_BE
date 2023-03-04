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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesMiddleware = void 0;
const mongoose = __importStar(require("mongoose"));
const common_constants_1 = require("../../common/common.constants");
const messageModel_1 = require("../../models/messageModel");
const userModel_1 = require("../../models/userModel");
const convertStationModel_1 = require("../../models/convertStationModel");
const Messages = mongoose.model(common_constants_1.TitleModel.MESSAGES, messageModel_1.MessagesSchema);
const ConvertStation = mongoose.model(common_constants_1.TitleModel.CONVERTSTATIONS, convertStationModel_1.ConvertStationSchema);
const Users = mongoose.model(common_constants_1.TitleModel.USERS, userModel_1.UsersSchema);
class MessagesMiddleware {
    checkUserId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const senderInfor = yield Users.findOne({
                _id: req.body.senderId,
            });
            if (!senderInfor) {
                return res.status(400).send({
                    code: 400,
                    message: 'sender id not found!',
                    success: false,
                });
            }
            if (senderInfor) {
                next();
            }
        });
    }
    checkConvertStationId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertStationId = yield ConvertStation.findOne({
                _id: req.body.conversationId,
            });
            if (!convertStationId) {
                return res.status(400).send({
                    code: 400,
                    message: 'convert station id not found!',
                    success: false,
                });
            }
            if (convertStationId) {
                next();
            }
        });
    }
}
exports.MessagesMiddleware = MessagesMiddleware;
//# sourceMappingURL=message.middleware.js.map