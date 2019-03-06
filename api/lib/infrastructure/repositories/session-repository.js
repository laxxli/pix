const _ = require('lodash');

const BookshelfSession = require('../data/session');
const Session = require('../../domain/models/Session');
const CertificationCourse = require('../../domain/models/CertificationCourse');
const { NotFoundError } = require('../../domain/errors');
const moment = require('moment');

function _toDomain(bookshelfSession) {
  if (bookshelfSession) {
    const sessionReturned = bookshelfSession.toJSON();
    sessionReturned.date = moment(sessionReturned.date, moment.ISO_8601, true).format('YYYY-MM-DD');
    sessionReturned.time = moment(sessionReturned.time, ['HH:mm', 'HH:mm:ss'], true).format('HH:mm');
    sessionReturned.certifications = bookshelfSession.related('certificationCourses').map((certificationCourse) => {
      return CertificationCourse.fromAttributes(certificationCourse);
    });
    return new Session(sessionReturned);
  }
  return null;
}

module.exports = {
  save: (sessionToBeSaved) => {
    sessionToBeSaved = _.omit(sessionToBeSaved, ['certifications']);

    return new BookshelfSession(sessionToBeSaved)
      .save()
      .then(_toDomain);
  },

  isSessionCodeAvailable: (accessCode) => {
    return BookshelfSession
      .where({ accessCode })
      .fetch({})
      .then((result) => !result);
  },

  getByAccessCode: (accessCode) => {
    return BookshelfSession
      .where({ accessCode })
      .fetch({})
      .then(_toDomain);
  },

  get(idSession) {
    return BookshelfSession
      .where({ id: idSession })
      .fetch({ require: true, withRelated: ['certificationCourses'] })
      .then(_toDomain)
      .catch((error) => {
        if (error instanceof BookshelfSession.NotFoundError) {
          return Promise.reject(new NotFoundError());
        }
        return Promise.reject(error);
      });
  },

  update(session) {
    const sessionDataToUpdate = _.pick(
      session,
      [
        'address',
        'room',
        'accessCode',
        'examiner',
        'date',
        'time',
        'description'
      ]
    );

    return new BookshelfSession({ id: session.id })
      .save(sessionDataToUpdate, { patch: true })
      .then((model) => model.refresh())
      .then(_toDomain);
  },

  find() {
    return BookshelfSession
      .query((qb) => {
        qb.orderBy('createdAt', 'desc')
          .limit(10); // remove after pagination
      })
      .fetchAll({})
      .then((sessions) => sessions.map(_toDomain));
  },

  findByCertificationCenterId(certificationCenterId) {
    return BookshelfSession
      .where({ certificationCenterId })
      .query((qb) => {
        qb.orderBy('date', 'desc');
        qb.orderBy('time', 'desc');
      })
      .fetchAll({})
      .then((sessions) => sessions.map(_toDomain));
  }
};
