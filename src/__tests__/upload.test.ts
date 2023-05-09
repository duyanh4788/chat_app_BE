import supertest from 'supertest';
import App from '../app/App';

const SUCCESS = 200;
const ERROR = 404;

let TOKEN: any;

const userPayload = {
  account: 'anhvu',
  passWord: '1'
};

let idImage: any;

describe('upload', () => {
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

    it('Error', async () => {
      /**
       * 400 : pass id valid, account not found, user login by orther app
       * 500 : server or DB error
       */
      const { statusCode } = await supertest(App).post('/api/v1/users/signIn').send();
      expect(statusCode).toBe(ERROR);
    });
  });

  describe('POST/upload-aws3', () => {
    const testImagePath: any = `${_pathFile}/img-test/test001.jpg`; // ** copy file img test001.jpg in floder img-test
    it.only('Success', async () => {
      const { body } = await supertest(App)
        .post('/api/v1/images/upload-aws3')
        .set('Authorization', TOKEN)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', testImagePath)
        .expect(SUCCESS);
      idImage = body?.data;
    });

    it.only('Error', async () => {
      /**
       * 400 : error from multer
       * 401 : valid token in header
       * 404 : upload failed
       * 500 : server or DB error
       */
      await supertest(App)
        .post('/api/v1/images/upload-aws3')
        .field('Content-Type', 'multipart/form-data')
        .attach('image', '')
        .set('Authorization', TOKEN)
        .expect(ERROR);
    });
  });

  describe('POST/remove-img-aws3', () => {
    it.only('Success', async () => {
      await supertest(App).post('/api/v1/images/remove-img-aws3').send({ idImage }).set('Authorization', TOKEN).expect(SUCCESS);
    });

    it.only('Error', async () => {
      /**
       * 400 : images not valid!
       * 401 : valid token in header
       * 500 : server or DB error
       */
      await supertest(App).post('/api/v1/messages/remove-img-aws3').send().expect(ERROR);
    });
  });
});
