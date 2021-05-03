const { AccessCode } = require('./AccessCode');
const moment = require('moment');
const Joi = require('joi');

class Session {
  constructor({
    certificationCenterId,
    certificationCenterName,
    accessCode,
    address,
    examiner,
    room,
    date,
    time,
    description,
  }) {
    this.certificationCenterId = certificationCenterId;
    this.certificationCenterName = certificationCenterName;
    this.accessCode = accessCode;
    this.address = address;
    this.examiner = examiner;
    this.room = room;
    this.date = date;
    this.time = time;
    this.description = description;

    validate(this);
  }

  static schedule({
    certificationCenterId,
    certificationCenterName,
    address,
    examiner,
    room,
    date,
    time,
    description,
  }, pickOneFrom) {
    // On ne peut pas, avec certitude, valider la règle de "date ne doit pas être avant aujourd'hui"
    // car on ne connaît pas la timezone du lieu où se déroule la session
    return new Session({
      certificationCenterId,
      certificationCenterName,
      accessCode: AccessCode.generate(pickOneFrom),
      address,
      examiner,
      room,
      date,
      time,
      description,
    });
  }
}

const schema = Joi.object({
  certificationCenterId: Joi.number().integer().positive().required(),
  certificationCenterName: Joi.any(),
  accessCode: Joi.any().required(),
  address: Joi.string().required(),
  examiner: Joi.string().required(),
  room: Joi.string().required(),
  date: Joi.string().custom(_validateDate).required(),
  time: Joi.string().custom(_validateTime).required(),
  description: Joi.any(),
});

function validate(session) {
  const { error } = schema.validate(session);

  if (error) {
    throw new Error(error);
  }
}

function _validateDate(aDate) {
  if ('string' != typeof aDate) {
    throw new Error('Should be a string');
  }

  const format = 'YYYY-MM-DD';
  if (!moment(aDate, format, true).isValid()) {
    throw new Error(`Expected ${format} format`);
  }

  return aDate;
}

function _validateTime(aTime) {
  if ('string' != typeof aTime) {
    throw new Error('Should be a string');
  }

  const format = 'HH:mm';
  if (!moment(aTime, format, true).isValid()) {
    throw new Error(`Expected ${format} format`);
  }

  return aTime;
}

module.exports = {
  Session,
};
