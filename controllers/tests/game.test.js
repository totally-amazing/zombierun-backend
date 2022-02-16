const { createRequest, createResponse } = require('node-mocks-http');

const { getGamesByUserId, Game } = require('../../models/Game');
const dummyUsers = require('../../models/sample_user.json');
const dummyGames = require('../../models/sample_game.json');
const { getTotalRecord, getRecentRecord } = require('../game');
const User = require('../../models/User');

jest.mock('../../models/Game', () => ({
  getGamesByUserId: jest.fn(),
  Game: { findById: jest.fn() },
}));

jest.mock('../../models/User');

describe('Game Controller', () => {
  describe('getTotalRecord', () => {
    it('query로 받은 id와 일치하는 유저의 total record를 응답한다.', async () => {
      const req = createRequest({
        query: {
          userId: dummyUsers[1]._id,
        },
      });
      const res = createResponse();
      getGamesByUserId.mockResolvedValue(
        dummyGames.filter(({ players }) =>
          players.find(({ id }) => id === dummyUsers[1]._id)
        )
      );

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
  describe('getRecentRecord', () => {
    it('query로 받은 id와 일치하는 유저의 recent record를 응답한다.', async () => {
      const userId = '61fb6ad0939afdfb71e704ae';
      const req = createRequest({
        query: {
          userId,
        },
      });
      const res = createResponse();
      const dummyUser = dummyUsers.find((user) => user._id === userId);

      User.findById = async () => dummyUser;
      const lastGameId =
        dummyUser.gameHistory[dummyUser.gameHistory.length - 1];
      Game.findById.mockResolvedValue(
        dummyGames.find((game) => game._id === lastGameId)
      );

      await getRecentRecord(req, res);

      expect(res._getData()).toEqual({
        distance: 1.4,
        time: 30,
        speed: 3.6,
        isWinner: true,
        mode: 'survival',
        role: 'human',
      });
    });
  });
});
