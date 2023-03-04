"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const user_controller_1 = require("../../controllers/user.controller");
const authUser_middleware_1 = require("../../middlewares/auth/authUser.middleware");
const verifyToken_middleware_1 = require("../../middlewares/auth/verifyToken.middleware");
class UsersRoutes {
    constructor() {
        this.usersController = new user_controller_1.UsersControler();
        this.authMiddleware = new authUser_middleware_1.AuthUserMiddleware();
        this.verifyTokenMiddleware = new verifyToken_middleware_1.VerifyTokenMiddleware();
    }
    routes(app) {
        app
            .route('/api/v1/listUser')
            .get(this.verifyTokenMiddleware.authenTicate, this.usersController.getListUser);
        app
            .route('/api/v1/getUserById/:id')
            .get(this.verifyTokenMiddleware.authenTicate, this.usersController.getUserById);
        app.route('/api/v1/signIn').post(this.usersController.userSignIn);
        app
            .route('/api/v1/signUp')
            .post(this.authMiddleware.checkAccount, this.authMiddleware.checkEmailExits, this.authMiddleware.checkEmpty, this.authMiddleware.checkEmailPattern, this.authMiddleware.checkReqLength, this.usersController.userSignUp);
        app
            .route('/api/v1/changeStatusOnline')
            .post(this.usersController.changeStatusOnline);
        app
            .route('/api/v1/changeStatusOffline')
            .post(this.usersController.changeStatusOffline);
    }
}
exports.UsersRoutes = UsersRoutes;
//# sourceMappingURL=user.routes.js.map