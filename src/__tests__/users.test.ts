import supertest from 'supertest';
import App from '../app/App';
import mongoose from 'mongoose';
import { StatusCreate, UserTypeCreate } from '../common/common.enum';

const userPayload = {
  account: 'Test01',
  passWord: 'pass@123',
  fullName: 'Test 01',
  email: 'test01@example.com',
  statusCreate: StatusCreate.IN_ACTIVE,
  userTypeCreate: UserTypeCreate.CHATAPP
};

const userResponse = {
  code: 200,
  data: null,
  message: 'sign up successfully, please check email or spam and active account.',
  option: null,
  status: 'success'
};

describe('users', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/chatApp');
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('user sign up', () => {
    describe('given the username so registed', () => {
      it('should return the userCreated', async () => {
        const { statusCode, body } = await supertest(App).post('/api/v1/users/signUp').send(userPayload);
        expect(statusCode).toBe(200);
        expect(body).toEqual(userResponse);
      });
    });
  });

  describe('get list users router', () => {
    describe('given the user cannot login', () => {
      it('should return a 401', async () => {
        await supertest(App).get('/api/v1/users/listUser').expect(401);
      });
    });
  });
});
