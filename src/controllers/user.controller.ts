import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as JWT from 'jsonwebtoken';
import { UsersSchema } from '../models/userModel';
import { Request, Response } from 'express';
import { TitleModel, SECRETKEY } from '../common/common.constants';

const Users = mongoose.model(TitleModel.USERS, UsersSchema);

interface CheckAccount {
  id: mongoose.ObjectId;
  account: String;
  passWord: String;
  fullName: String;
  email: String;
  avatar: String;
  isOnline: Boolean;
  userTypeCode: String;
}

export class UsersControler {
  public async getListUser(req: Request, res: Response) {
    try {
      const userList = await Users.find({}).select([
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
    } catch (error) {
      res.status(500).send({
        code: 500,
        message: error,
        success: false,
      });
    }
  }

  public async getUserById(req: Request, res: Response) {
    try {
      const userById = await Users.findById(req.params.id).select([
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
    } catch (error) {
      res.status(500).send({
        code: 500,
        message: error,
        success: false,
      });
    }
  }

  public async userSignUp(req: Request, res: Response) {
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
      await newUser.save();
      res.status(200).send({
        data: 'Đăng ký thành công',
        code: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        code: 500,
        message: error,
        success: false,
      });
    }
  }

  public async userSignIn(req: Request, res: Response) {
    const { account, passWord } = req.body;
    try {
      const checkAccount: any = await Users.findOne({ account });
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
      const toKen = JWT.sign(header, SECRETKEY, { expiresIn: 86400000 });
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
    } catch (error) {
      res.status(500).send({
        code: 500,
        message: error,
        success: false,
      });
    }
  }

  public async changeStatusOnline(req: Request, res: Response) {
    try {
      await Users.findByIdAndUpdate(req.body.id, {
        isOnline: true,
      });
      res.status(200).send({
        data: null,
        code: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        code: 500,
        message: error,
        success: false,
      });
    }
  }

  public async changeStatusOffline(req: Request, res: Response) {
    try {
      if (!req.body.id) {
        return res.status(400).send({
          code: 400,
          message: 'Id not found',
          success: false,
        });
      }
      await Users.findByIdAndUpdate(req.body.id, {
        isOnline: false,
      });
      res.status(200).send({
        data: null,
        code: 200,
        success: true,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
