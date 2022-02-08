const { createRequest, createResponse } = require('node-mocks-http');

const dummyRooms = require('../../models/sample_room.json');
const Room = require('../../models/Room');
const { getRoomList } = require('../room');

jest.mock('../../models/Room');

describe('RoomCotroller', () => {
  describe('getRoomList', () => {
    it('해당 Url로 요청을 보낼 시 현재 활성화된 전체 방 관련 데이터를 가져온다', async () => {
      const req = createRequest();
      const res = createResponse();

      Room.find.mockImplementation(() => ({
        lean: jest.fn().mockReturnValue(dummyRooms),
      }));

      await getRoomList(req, res);

      expect(res._getData()).toEqual(dummyRooms);
    });
  });
});
