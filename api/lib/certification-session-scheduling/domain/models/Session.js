module.exports = class Session {
  constructor({
    certificationCenterId,
    address,
    examiner,
    room,
    date,
    time,
    description,
  }) {
    // TODO : throw if required properties are missing
    this.certificationCenterId = certificationCenterId;
    this.address = address;
    this.examiner = examiner;
    this.room = room;
    this.date = date;
    this.time = time;
    this.description = description;
  }
};
