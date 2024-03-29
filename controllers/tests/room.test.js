const { createRequest, createResponse } = require('node-mocks-http');

const dummyRooms = require('../../models/sample_room.json');
const Room = require('../../models/Room');
const { getRoomList, createRoom, deleteRoom } = require('../room');

jest.mock('../../models/Room');

describe('Room Cotroller', () => {
  describe('getRoomList', () => {
    it('해당 Url로 요청을 보낼 시 현재 활성화된 전체 방 관련 데이터를 가져온다', async () => {
      const req = createRequest();
      const res = createResponse();

      Room.find = jest.fn(async () => dummyRooms);

      await getRoomList(req, res);

      expect(res._getData()).toEqual(dummyRooms);
    });
  });

  describe('createRoom', () => {
    it('새로운 room을 생성하고 room id로 응답한다', async () => {
      const room = {
        mode: 'mode',
        title: 'title',
        speed: 'speed',
        time: 'time',
      };
      const req = createRequest({
        url: '/room',
        method: 'POST',
        body: room,
      });
      const res = createResponse();
      Room.create = jest.fn(async () => ({ id: 'id' }));

      await createRoom(req, res);

      expect(Room.create).toBeCalledWith({ ...room, participants: [] });
      expect(res._getData()).toEqual({ id: 'id' });
    });
  });

  describe('deleteRoom', () => {
    it('존재하는 방을 삭제하고 204 http 요청메서드를 응답한다', async () => {
      const id = '6204817fd89446b84f8d8130';
      const req = createRequest({
        url: '/room',
        method: 'DELETE',
        params: {
          id,
        },
      });
      const res = createResponse();
      Room.deleteOne = jest.fn(async () => {});

      await deleteRoom(req, res);

      expect(Room.deleteOne).toBeCalledWith({ id });
      expect(res.statusCode).toBe(204);
    });
  });
});
