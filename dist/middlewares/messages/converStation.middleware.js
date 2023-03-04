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
exports.ConverStationMiddleware = void 0;
const mongoose = __importStar(require("mongoose"));
const common_constants_1 = require("../../common/common.constants");
const convertStationModel_1 = require("../../models/convertStationModel");
const ConvertStation = mongoose.model(common_constants_1.TitleModel.CONVERTSTATIONS, convertStationModel_1.ConvertStationSchema);
class ConverStationMiddleware {
    checkEmptyId(req, res, next) {
        const { senderId, reciverId } = req.body;
        if (senderId &&
            senderId !== '' &&
            senderId !== null &&
            reciverId &&
            reciverId !== '' &&
            reciverId !== null) {
            return next();
        }
        else {
            return res.status(400).send({
                code: 400,
                message: 'Id Sender or Reciver is null',
                success: false,
            });
        }
    }
    getConverStationByUserId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, reciverId } = req.body;
            try {
                const converStationByUserId = yield ConvertStation.findOne({
                    members: { $all: [senderId, reciverId] },
                });
                if (converStationByUserId !== null) {
                    return res.status(200).send({
                        data: converStationByUserId,
                        code: 200,
                        success: true,
                    });
                }
                if (converStationByUserId === null) {
                    next();
                }
            }
            catch (error) {
                res.status(500).send({
                    code: 500,
                    message: error,
                    success: false,
                });
            }
        });
    }
}
exports.ConverStationMiddleware = ConverStationMiddleware;
//# sourceMappingURL=converStation.middleware.js.map