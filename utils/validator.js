const mongoose = require('mongoose');

const User = require('../models/User');

function required(value) {
  if (!value) {
    throw new Error('value가 없습니다');
  }
}

async function validateId(id) {
  if (!id) {
    throw new Error('id가 없습니다');
  }

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

function checkTypeofNumber(number) {
  if (!(typeof number === 'number')) {
    throw new Error('숫자가 아닙니다');
  }
}

function checkTypeofString(string) {
  if (!(typeof string === 'string')) {
    throw new Error('글자가 아닙니다');
  }
}

function checkTypeofBoolean(boolean) {
  if (!(typeof boolean === 'boolean')) {
    throw new Error('불린이 아닙니다');
  }
}

module.exports = {
  required,
  validateId,
  findExistentUserId,
  checkTypeofNumber,
  checkTypeofString,
  checkTypeofBoolean,
};
