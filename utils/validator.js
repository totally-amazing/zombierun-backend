const mongoose = require('mongoose');

const User = require('../models/User');

function required(array) {
  if (array.every((value) => value == null)) {
    throw new Error(`값이 존재하지 않습니다. value: ${array}`);
  }
}

function validateId(id) {
  required([id]);

  if (!mongoose.isValidObjectId(id)) {
    throw new Error(`유효하지 않은 id입니다: ${id}`);
  }
}

async function findExistentUserId(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error(`해당 user를 찾을 수 없습니다 user id : ${userId}`);
  }
}

function checkTypeOfNumber(number) {
  if (!(typeof number === 'number')) {
    throw new Error(`${number}는 숫자가 아닙니다`);
  }
}

function checkTypeOfString(string) {
  if (!(typeof string === 'string')) {
    throw new Error(`${string}은 문자열이 아닙니다`);
  }
}

function checkTypeOfBoolean(boolean) {
  if (!(typeof boolean === 'boolean')) {
    throw new Error(`${boolean}은 불리언이 아닙니다`);
  }
}

function checkTypeOfMode(mode) {
  if (!['survival', 'oneOnOne', 'solo'].includes(mode)) {
    throw new Error(
      `mode는 survival, oneOnOne, solo 중에 하나여야 합니다 mode: ${mode}`
    );
  }
}

function checkTypeOfRole(role) {
  if (!['human', 'zombie'].includes(role)) {
    throw new Error(`role은 human, zombie 중에 하나여야 합니다 role: ${role}`);
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
