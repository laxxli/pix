const { validate: validateSession } = require('./SessionValidator');
const { validate: validateAccessCode } = require('./AccessCodeValidator');

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

    validateSession(this);
  }

  static schedule({
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
    // On ne peut pas, avec certitude, valider la règle de "date ne doit pas être avant aujourd'hui"
    // car on ne connaît pas la timezone du lieu où se déroule la session
    return new Session({
      certificationCenterId,
      certificationCenterName,
      accessCode,
      address,
      examiner,
      room,
      date,
      time,
      description,
    });
  }
}

class SessionDateShouldNotBeInThePastError extends Error {
  constructor(message = 'Erreur lors de la plannification de la session. La date ne doit pas être dans le passé.') {
    super(message);
  }
}

class AccessCode {
  constructor({
    value,
  }) {
    this.value = value;

    validateAccessCode(this);
  }
}

module.exports = {
  AccessCode,
  Session,
  SessionDateShouldNotBeInThePastError,
};
