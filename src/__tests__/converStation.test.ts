import supertest from 'supertest';
import App from '../app/App';

const SUCCESS = 200;
const ERROR = 404;

let TOKEN: any;

const userPayload = {
  account: 'Test02',
  passWord: 'pass@123'
};

const converStationPayload = {
  senderId: '6414389f2f9f13584e7c8b2a',
  reciverId: '641438aa2f9f13584e7c8b31'
};

describe('converStation', () => {
  describe('POST/signIn', () => {
    it.only('Success', async () => {
      const { statusCode, body } = await supertest(App).post('/api/v1/users/signIn').send(userPayload);
      expect(statusCode).toBe(SUCCESS);
      TOKEN = body.data.toKen;
    });

    it('Error', async () => {
      /**
       * 400 : pass id valid, account not found, user login by orther app
       * 500 : server or DB error
       */
      const { statusCode } = await supertest(App).post('/api/v1/users/signIn').send();
      expect(statusCode).toBe(ERROR);
    });
  });

  describe('POST/saveConvertStation', () => {
    it.only('Success', async () => {
      await supertest(App).post('/api/v1/convertStations/saveConvertStation').send(converStationPayload).set('Authorization', TOKEN).expect(SUCCESS);
    });

    it.only('Error', async () => {
      /**
       * 400 : create failed
       * 401 : valid token in header
       * 404 : request not availible
       * 500 : server or DB error
       */
      await supertest(App).get('/api/v1/convertStations/saveConvertStation').send().expect(ERROR);
    });
  });
});
