const { validate: validateSession } = require('./SessionValidator');
const { AccessCode } = require('./AccessCode');

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

module.exports = {
  Session,
};
