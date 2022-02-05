const { createRequest, createResponse } = require('node-mocks-http');

const Game = require('../../models/Game');
const dummyUser = require('../../models/sample_user.json')[1];
const dummyGames = require('../../models/sample_game.json');
const { getTotalRecord } = require('../user');

jest.mock('../../models/Game');

describe('User Controller', () => {
  describe('getTotalRecord', () => {
    it('parameter로 받은 id와 일치하는 유저의 total record를 응답한다.', async () => {
      const req = createRequest({
        params: {
          id: dummyUser._id,
        },
      });
      const res = createResponse();
      Game.find = jest.fn(() => ({
        lean: async () => dummyGames,
      }));

      await getTotalRecord(req, res);

      expect(res._getData()).toEqual({
        distance: 3.8,
        time: 90,
        solo: {
          isWinner: 1,
          isLoser: 1,
        },
        oneOnOne: {
          isWinner: 1,
          isLoser: 0,
        },
        survival: {
          isWinner: 0,
        },
      });
    });
  });
});
