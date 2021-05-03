const { validate: validateAccessCode } = require('./AccessCodeValidator');

const validLettersInAccessCode = 'ABCDEFGHIJKLMNOPQRSTUVWXZ'.split('');
const validNumbersInAccessCode = '0123456789'.split('');
class AccessCode {
  constructor({
    value,
  }) {
    this.value = value;

    validateAccessCode(this);
  }

  static generate(pickOneFrom) {
    const value =
      pickOneFrom(validLettersInAccessCode) +
      pickOneFrom(validLettersInAccessCode) +
      pickOneFrom(validLettersInAccessCode) +
      pickOneFrom(validLettersInAccessCode) +
      pickOneFrom(validNumbersInAccessCode) +
      pickOneFrom(validNumbersInAccessCode);
    return new AccessCode({ value });
  }
}

module.exports = {
  AccessCode,
};
