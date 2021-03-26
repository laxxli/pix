class Session {
  constructor({
    certificationCenterId,
    certificationCenter,
    accessCode,
    address,
    examiner,
    room,
    date,
    time,
    description,
  }) {
    // TODO : throw if required properties are missing
    this.certificationCenterId = certificationCenterId;
    this.certificationCenter = certificationCenter;
    this.accessCode = accessCode;
    this.address = address;
    this.examiner = examiner;
    this.room = room;
    this.date = date;
    this.time = time;
    this.description = description;
  }

  static schedule({
    certificationCenterId,
    certificationCenter,
    accessCode,
    address,
    examiner,
    room,
    date,
    time,
    description,
  }) {
    return new Session({
      certificationCenterId,
      certificationCenter,
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

module.exports = {
  Session,
  SessionDateShouldNotBeInThePastError,
};
