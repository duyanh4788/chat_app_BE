import { Router } from 'express';
import { VerifyTokenMiddleware } from '../../middlewares/auth/VerifyTokenMiddleware';
import { FriendsController } from '../../controllers/FriendsController';
import { FriendsUseCase } from '../../usecase/FriendsUseCase';
import { FriendsDriversController } from '../../MongoDriversController/FriendsDriversController';
import { UserDriversController } from '../../MongoDriversController/UserDriversController';
import { FriendsMiddleware } from '../../middlewares/friend/FriendsMiddleware';

const BASE_ROUTE = '/friends';

enum Routes {
  ADD_FRIEND = '/add-friends',
  GET_LIST_FRIENDS = '/get-list-friends'
}

export class FriendsRoutes {
  private verifyTokenMiddleware: VerifyTokenMiddleware = new VerifyTokenMiddleware();
  private friendsDriversRepository: FriendsDriversController = new FriendsDriversController();
  private userDriversRepository: UserDriversController = new UserDriversController();
  private friendsMiddleware: FriendsMiddleware = new FriendsMiddleware(this.friendsDriversRepository, this.userDriversRepository);
  private friendsUseCase: FriendsUseCase = new FriendsUseCase(this.friendsDriversRepository, this.userDriversRepository);
  private friendsController: FriendsController = new FriendsController(this.friendsUseCase);

  public routes(app: Router): void {
    app.post(
      BASE_ROUTE + Routes.ADD_FRIEND,
      this.verifyTokenMiddleware.authenTicate,
      this.friendsMiddleware.checkFriendId,
      this.friendsController.addFriends
    );
    app.get(BASE_ROUTE + Routes.GET_LIST_FRIENDS, this.verifyTokenMiddleware.authenTicate, this.friendsController.getListFriends);
  }
}
