const mongoose = require('mongoose');

const User = require('../models/User');

function required(array) {
  if (!array.every((value) => value !== undefined)) {
    throw new Error(`array의 undefined가 존재합니다. ${array}`);
  }
}

function validateId(id) {
  required([id]);

  if (!mongoose.isValidObjectId(id)) {
    throw new Error('유효하지 않은 id입니다');
  }
}

async function findExistentUserId(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('해당 userId를 찾을 수 없습니다');
  }
}

function checkTypeOfNumber(number) {
  if (!(typeof number === 'number')) {
    throw new Error('숫자가 아닙니다');
  }
}

function checkTypeOfString(string) {
  if (!(typeof string === 'string')) {
    throw new Error('글자가 아닙니다');
  }
}

function checkTypeOfBoolean(boolean) {
  if (!(typeof boolean === 'boolean')) {
    throw new Error('불린이 아닙니다');
  }
}

function checkTypeOfMode(mode) {
  if (!['survival', 'oneOnOne', 'solo'].includes(mode)) {
    throw new Error('mode는 survival, oneOnOne, solo 중에 하나여야 합니다');
  }
}

function checkTypeOfRole(role) {
  if (!['human', 'zombie'].includes(role)) {
    throw new Error('role은 human, zombie 중에 하나여야 합니다');
  }
}

module.exports = {
  required,
  validateId,
  findExistentUserId,
  checkTypeOfNumber,
  checkTypeOfString,
  checkTypeOfBoolean,
  checkTypeOfMode,
  checkTypeOfRole,
};
