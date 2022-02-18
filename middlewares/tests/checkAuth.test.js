const jwt = require('jsonwebtoken');
const { createRequest, createResponse } = require('node-mocks-http');

const { createAuthMiddleware } = require('../checkAuth');
const TokenService = require('../../service/__mocks__/token');

jest.mock('jsonwebtoken');

describe('checkAuth', () => {
  let res;
  let tokenService;
  beforeEach(() => {
    res = createResponse();
    tokenService = new TokenService();
  });

  it('Authorization 헤더가 없으면 401을 응답한다', async () => {
    const req = createRequest();

    await createAuthMiddleware(tokenService)(req, res);

    expect(res._getStatusCode()).toBe(401);
  });

  it('accessToken이 부적합하면 401을 응답한다', async () => {
    const req = createRequest({
      headers: {
        authorization: 'Bearer invalidToken',
      },
    });

    await createAuthMiddleware(tokenService)(req, res);

    expect(res._getStatusCode()).toBe(401);
  });

  it('accessToken이 만료되면 refreshToken을 검증한다', async () => {
    const req = createRequest({
      headers: {
        authorization: 'Bearer expiredToken',
      },
    });
    const next = jest.fn();
    jwt.verify = () => {
      const error = new Error();
      error.name = 'TokenExpiredError';
      throw error;
    };
    const spyIsTokenValid = jest
      .spyOn(tokenService, 'isTokenValid')
      .mockImplementation(() => false);

    await createAuthMiddleware(tokenService)(req, res, next);

    expect(spyIsTokenValid).toHaveBeenCalledWith('refreshToken');
    expect(next).not.toBeCalled();
    expect(res._getStatusCode()).toBe(401);
  });

  it('refreshToken이 유효하면 accessToken을 새로 발급한다', async () => {
    const req = createRequest({
      headers: {
        authorization: 'Bearer expiredToken',
      },
    });
    const next = jest.fn();
    jwt.verify = () => {
      const error = new Error();
      error.name = 'TokenExpiredError';
      throw error;
    };
    const spyIsTokenValid = jest
      .spyOn(tokenService, 'isTokenValid')
      .mockImplementation(() => true);

    await createAuthMiddleware(tokenService)(req, res, next);

    expect(spyIsTokenValid).toHaveBeenCalledWith('refreshToken');
    expect(next).toHaveBeenCalled();
    expect(req).toMatchObject({
      userId: 'id',
      token: 'accessToken',
    });
  });
});
