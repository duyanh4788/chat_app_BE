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
exports.UsersControler = void 0;
const mongoose = __importStar(require("mongoose"));
const bcrypt = __importStar(require("bcryptjs"));
const JWT = __importStar(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const common_constants_1 = require("../common/common.constants");
const Users = mongoose.model(common_constants_1.TitleModel.USERS, userModel_1.UsersSchema);
class UsersControler {
    getListUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userList = yield Users.find({}).select([
                    'account',
                    'fullName',
                    'email',
                    'avatar',
                    'isOnline',
                ]);
                !userList &&
                    res.status(400).send({
                        code: 400,
                        message: 'DATA NOT FOUND!',
                        success: false,
                    });
                userList &&
                    res.status(200).send({
                        data: userList,
                        code: 200,
                        success: true,
                    });
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
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userById = yield Users.findById(req.params.id).select([
                    'account',
                    'fullName',
                    'email',
                    'avatar',
                    'isOnline',
                    '_id',
                ]);
                !userById &&
                    res.status(400).send({
                        code: 400,
                        message: 'User not found!',
                        success: false,
                    });
                userById &&
                    res.status(200).send({
                        data: userById,
                        code: 200,
                        success: true,
                    });
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
    userSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { account, passWord, fullName, email } = req.body;
                const salt = bcrypt.genSaltSync(10);
                const hashPassWord = bcrypt.hashSync(passWord, salt);
                const newUser = new Users({
                    account,
                    passWord: hashPassWord,
                    fullName,
                    email,
                });
                yield newUser.save();
                res.status(200).send({
                    data: 'Đăng ký thành công',
                    code: 200,
                    success: true,
                });
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
    userSignIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { account, passWord } = req.body;
            try {
                const checkAccount = yield Users.findOne({ account });
                if (!checkAccount) {
                    return res.status(400).send({
                        code: 400,
                        message: 'Tài khoản không tồn tại vui lòng đăng ký',
                        success: false,
                    });
                }
                const checkPassWord = bcrypt.compareSync(passWord, checkAccount.passWord);
                if (!checkPassWord) {
                    return res.status(400).send({
                        code: 400,
                        message: 'Mật khẩu không đúng',
                        success: false,
                    });
                }
                const header = {
                    _id: checkAccount.id,
                    account: checkAccount.account,
                    userTypeCode: checkAccount.userTypeCode,
                };
                const toKen = JWT.sign(header, common_constants_1.SECRETKEY, { expiresIn: 86400000 });
                if (checkPassWord) {
                    const infoUser = {
                        _id: checkAccount.id,
                        account: checkAccount.account,
                        fullName: checkAccount.fullName,
                        email: checkAccount.email,
                        avatar: checkAccount.avatar,
                        isOnline: checkAccount.isOnline,
                        userTypeCode: checkAccount.userTypeCode,
                        toKen,
                    };
                    return res.status(200).send({
                        data: infoUser,
                        code: 200,
                        success: true,
                    });
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
    changeStatusOnline(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Users.findByIdAndUpdate(req.body.id, {
                    isOnline: true,
                });
                res.status(200).send({
                    data: null,
                    code: 200,
                    success: true,
                });
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
    changeStatusOffline(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.id) {
                    return res.status(400).send({
                        code: 400,
                        message: 'Id not found',
                        success: false,
                    });
                }
                yield Users.findByIdAndUpdate(req.body.id, {
                    isOnline: false,
                });
                res.status(200).send({
                    data: null,
                    code: 200,
                    success: true,
                });
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
}
exports.UsersControler = UsersControler;
//# sourceMappingURL=user.controller.js.map