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
exports.AuthUserMiddleware = void 0;
const common_constants_1 = require("../../common/common.constants");
const userModel_1 = require("../../models/userModel");
const mongoose = __importStar(require("mongoose"));
const Users = mongoose.model(common_constants_1.TitleModel.USERS, userModel_1.UsersSchema);
class AuthUserMiddleware {
    checkEmpty(req, res, next) {
        const { account, passWord, fullName, email } = req.body;
        if (account !== '' && passWord !== '' && fullName !== '' && email !== '') {
            next();
        }
        else {
            res.status(400).send({
                code: 400,
                message: 'Vui lòng nhập đầy đủ thông tin',
                success: false,
            });
        }
    }
    checkAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { account } = req.body;
            const data = yield Users.findOne({ account });
            if (!data) {
                next();
            }
            else {
                res.status(400).send({
                    code: 400,
                    message: 'Tài khoản đã tồn tại',
                    success: false,
                });
            }
        });
    }
    checkEmailPattern(req, res, next) {
        const { email } = req.body;
        const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email.match(pattern)) {
            next();
        }
        else {
            res.status(400).send({
                code: 400,
                message: 'Vui lòng nhập đúng định dạng email',
                success: false,
            });
        }
    }
    checkEmailExits(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const data = yield Users.findOne({ email });
            if (!data) {
                next();
            }
            else {
                res.status(400).send({
                    code: 400,
                    message: 'Email đã tồn tại',
                    success: false,
                });
            }
        });
    }
    checkAccountSingin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { account } = req.body;
            const data = yield Users.findOne({ account });
            if (data) {
                next();
            }
            else {
                res.status(400).send({
                    code: 400,
                    message: 'Tài khoàn không tồn tại',
                    success: false,
                });
            }
        });
    }
    checkNumber(req, res, next) {
        const { phone } = req.body;
        const pattern = /^[0-9]+$/;
        if (phone && phone.match(pattern)) {
            next();
        }
        else {
            res.status(400).send({
                code: 400,
                message: 'Vui lòng nhập số',
                success: false,
            });
        }
    }
    checkReqLength(req, res, next) {
        const { account } = req.body;
        if (account.length > 4 && account.length < 30) {
            next();
        }
        else {
            res.status(400).send({
                code: 400,
                message: 'Độ dài tài khoản từ 6 => 20',
                success: false,
            });
        }
    }
    checkFullName(req, res, next) {
        const { fullName } = req.body;
        if (fullName !== typeof 'string') {
            next();
        }
        else {
            res.status(400).send({
                code: 400,
                message: 'Họ tên sai định dạng',
                success: false,
            });
        }
    }
}
exports.AuthUserMiddleware = AuthUserMiddleware;
//# sourceMappingURL=authUser.middleware.js.map