import supertest from 'supertest';
import App from '../app/App';

const SUCCESS = 200;
const ERROR = 401;

let TOKEN: any;

const userPayload = {
  account: 'anhvu',
  passWord: '1'
};

const messagesPayload = {
  conversationId: '642ce556d84c8ab81c77cbe6',
  skip: 10
};

const postNewMessagesPayload = {
  conversationId: '642ce556d84c8ab81c77cbe6',
  senderId: '642ce3f4d84c8ab81c77cbc5',
  reciverId: '642ce4bed84c8ab81c77cbd6',
  text: 'TEST 000001'
};

describe('messages', () => {
  describe('POST/signIn', () => {
    it.only('Success', async () => {
      /**
       * 200 : ok
       * 202 : auth code by email
       * 203 : auth code by app
       */
      const { statusCode, body } = await supertest(App).post('/api/v1/users/signIn').send(userPayload);
      expect(statusCode).toBe(SUCCESS);
      TOKEN = body.data.toKen;
    });

    it.only('Error', async () => {
      /**
       * 400 : pass id valid, account not found, user login by orther app
       * 500 : server or DB error
       */
      const { statusCode } = await supertest(App).post('/api/v1/users/signIn').send();
      expect(statusCode).toBe(ERROR);
    });
  });

  describe('POST/getListMessages', () => {
    it.only('Success', async () => {
      await supertest(App).post('/api/v1/messages/getListMessages').send(messagesPayload).set('Authorization', TOKEN).expect(SUCCESS);
    });

    it.only('Error', async () => {
      /**
       * 400 : create failed
       * 401 : valid token in header
       * 404 : request not availible
       * 500 : server or DB error
       */
      await supertest(App).post('/api/v1/messages/getListMessages').send().expect(ERROR);
    });
  });

  describe('POST/newMessage', () => {
    it.only('Success', async () => {
      await supertest(App).post('/api/v1/messages/newMessage').send(postNewMessagesPayload).set('Authorization', TOKEN).expect(SUCCESS);
    });

    it.only('Error', async () => {
      /**
       * 400 : sender id not found!
       * 401 : valid token in header
       * 404 : request not availible
       * 500 : server or DB error
       */
      await supertest(App).post('/api/v1/messages/newMessage').send().expect(ERROR);
    });
  });
});
