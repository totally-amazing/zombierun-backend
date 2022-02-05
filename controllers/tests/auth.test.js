const { createRequest, createResponse } = require('node-mocks-http');

const User = require('../../models/User');
const authController = require('../auth');

jest.mock('../../service/oAuth');
jest.mock('../../service/token');
jest.mock('../../models/User');

describe('Auth Controller', () => {
  const user = {
    id: 'id',
    nickname: 'nickname',
    imageUrl: 'imageUrl',
  };
  describe('signIn', () => {
    it('데이터 베이스에 유저가 없으면 새로운 유저 데이터를 생성한다.', async () => {
      const req = createRequest({
        url: '/auth/signin',
        body: {
          idToken: 'idToken',
        },
      });
      const res = createResponse();
      User.findOne = async () => {};
      User.create = jest.fn(async () => user);

      await authController.signIn(req, res);

      expect(User.create).toHaveBeenCalled();
    });

    it('유저의 데이터베이스에 유저가 있으면 새로운 유저 데이터를 생성하지 말아야 한다.', async () => {
      const req = createRequest({
        url: '/auth/signin',
        body: {
          idToken: 'idToken',
        },
      });
      const res = createResponse();
      User.findOne = async () => user;
      User.create = jest.fn(async () => {});

      await authController.signIn(req, res);

      expect(User.create).not.toHaveBeenCalled();
    });

    it('유저의 데이터베이스에 refreshToken을 업데이트한다.', async () => {
      const req = createRequest({
        url: '/auth/signin',
        body: {
          idToken: 'idToken',
        },
      });
      const res = createResponse();
      User.findOne = async () => user;
      User.findByIdAndUpdate = jest.fn(async (userId, update) => {});

      await authController.signIn(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('id', {
        refreshToken: 'refreshToken',
      });
    });

    it('id, nickname, accessToken으로 응답한다.', async () => {
      const req = createRequest({
        url: '/auth/signin',
        body: {
          idToken: 'idToken',
        },
      });
      const res = createResponse();
      User.findOne = async () => user;

      await authController.signIn(req, res);

      expect(res._getData()).toEqual({
        id: 'id',
        nickname: 'nickname',
        token: 'accessToken',
      });
    });
  });
});
