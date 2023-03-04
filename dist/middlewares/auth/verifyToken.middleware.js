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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyTokenMiddleware = void 0;
const JWT = __importStar(require("jsonwebtoken"));
const common_constants_1 = require("../../common/common.constants");
class VerifyTokenMiddleware {
    authenTicate(req, res, next) {
        try {
            const token = req.header('Authorization');
            const deCode = JWT.verify(token, common_constants_1.SECRETKEY);
            if (deCode) {
                req.account = deCode;
                next();
            }
        }
        catch (error) {
            res.status(400).send({
                code: 400,
                message: 'Your are not sign in',
                success: false,
            });
        }
    }
    permissions(req, res, next) {
        try {
            if (common_constants_1.USER_TYPE_CODE.includes(req.account.userTypeCode) &&
                req.account !== parseInt(req.params.account)) {
                next();
            }
            else {
                throw new Error();
            }
        }
        catch (error) {
            res.status(400).send({
                code: 400,
                message: 'Your Are note permissions remove account',
                success: false,
            });
        }
    }
}
exports.VerifyTokenMiddleware = VerifyTokenMiddleware;
//# sourceMappingURL=verifyToken.middleware.js.map