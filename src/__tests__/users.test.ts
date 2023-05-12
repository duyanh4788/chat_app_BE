import supertest from 'supertest';
import App from '../app/App';
import mongoose from 'mongoose';

const SUCCESS = 200;
const ERROR = 500;

let TOKEN: any;

describe('users', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/chatApp');
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  const userPayload = {
    account: 'test02',
    passWord: '1',
    fullName: 'test02',
    email: 'test02@example.com'
  };

  describe('POST/signUp', () => {
    it.only('Success 200', async () => {
      const { statusCode, body } = await supertest(App).post('/api/v1/users/signUp').send(userPayload);
      expect(statusCode).toBe(SUCCESS);
      expect(body).toHaveProperty('message', 'sign up successfully, please check email or spam and active account.');
    });

    it.only('Error', async () => {
      /**
       * 401 : user can not active account
       * 400 : request not avalible
       * 404 : account or email exist
       * 500 : server or DB error
       */
      expect(async () => {
        await supertest(App).post('/api/v1/users/signUp').send(userPayload).expect(ERROR);
      }).rejects.toThrow();
    });
  });

  describe('GET/active', () => {
    const authCode = 'kanAS3';

    it('Success', async () => {
      /**
       * active successfully
       * resend code
       */
      const { statusCode, body } = await supertest(App).get(`/api/v1/users/active/${authCode}`);
      expect(statusCode).toBe(SUCCESS);
      expect(body).toHaveProperty('message', 'active successfully, please login.');
    });

    it('Error', async () => {
      /**
       * 401 : code valid
       * 400 : request not avalible
       * 500 : server or DB error
       */
      const { statusCode } = await supertest(App).get(`/api/v1/users/active/${authCode}`);
      expect(statusCode).toBe(ERROR);
    });
  });

  describe('POST/order-reset-password', () => {
    it('Success', async () => {
      await supertest(App).post('/api/v1/users/order-reset-password').send({ email: 'test02@example.com' }).expect(SUCCESS);
    });

    it('Error', async () => {
      await supertest(App).post('/api/v1/users/order-reset-password').expect(ERROR);
    });
  });

  describe('POST/resend-order-reset-password', () => {
    it('Success', async () => {
      await supertest(App).post('/api/v1/users/resend-order-reset-password').send({ email: 'test02@example.com' }).expect(SUCCESS);
    });

    it('Error', async () => {
      await supertest(App).post('/api/v1/users/resend-order-reset-password').send({ email: 'test02@example.com' }).expect(ERROR);
    });
  });

  describe('POST/reset-password', () => {
    it('Success', async () => {
      await supertest(App).post('/api/v1/users/reset-password').send({ authCode: 'jjNuBK', newPassWord: '123' }).expect(SUCCESS);
    });

    it('Error', async () => {
      await supertest(App).post('/api/v1/users/reset-password').send().expect(ERROR);
    });
  });

  describe('POST/signIn', () => {
    it('Success', async () => {
      const { statusCode, body } = await supertest(App).post('/api/v1/users/signIn').send(userPayload);
      expect(statusCode).toBe(SUCCESS);
      TOKEN = body.data.toKen;
    });

    it('Error', async () => {
      /**
       * 400 : pass id valid, account not found, user login by orther app
       * 500 : server or DB error
       */
      const { statusCode } = await supertest(App).post('/api/v1/users/signIn').send(userPayload);
      expect(statusCode).toBe(ERROR);
    });
  });

  describe('PUT/update-infor', () => {
    it('Success', async () => {
      const payload = { _id: '6458b75e573314cfe6a370b1', fullName: 'testtest', avatar: '', twofa: false, type2FA: '' };
      await supertest(App).put('/api/v1/users/update-infor').send(payload).expect(SUCCESS).set('Authorization', TOKEN);
    });

    it('Error', async () => {
      /**
       * 401 : valid token in header
       * 500 : server or DB error or request not availible
       */
      await supertest(App).put('/api/v1/users/update-infor').send().expect(ERROR).set('Authorization', TOKEN);
    });
  });

  describe('GET/listUser', () => {
    it('Success', async () => {
      await supertest(App).get('/api/v1/users/listUser').expect(SUCCESS).set('Authorization', TOKEN);
    });

    it('Error', async () => {
      /**
       * 401 : valid token in header
       * 500 : server or DB error
       */
      await supertest(App).get('/api/v1/users/listUser').expect(ERROR);
    });
  });
});
