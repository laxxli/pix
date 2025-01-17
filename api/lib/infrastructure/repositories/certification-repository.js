const AssessmentResultBookshelf = require('../orm-models/AssessmentResult');
const CertificationCourseBookshelf = require('../orm-models/CertificationCourse');
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
const Bookshelf = require('../bookshelf');
const CertificationAttestation = require('../../domain/models/CertificationAttestation');
const { NotFoundError, CertificationCourseNotPublishableError } = require('../../../lib/domain/errors');

async function getAssessmentResultsStatusesBySessionId(id) {
  const collection = await CertificationCourseBookshelf
    .query((qb) => {
      qb.innerJoin('assessments', 'assessments.certificationCourseId', 'certification-courses.id');
      qb.innerJoin(
        Bookshelf.knex.raw(
          `"assessment-results" ar ON ar."assessmentId" = "assessments".id
                    and ar."createdAt" = (select max(sar."createdAt") from "assessment-results" sar where sar."assessmentId" = "assessments".id)`,
        ),
      );
      qb.where({ 'certification-courses.sessionId': id });
    })
    .fetchAll({ columns: ['status'] });

  return collection.map((obj) => obj.attributes.status);
}

async function _getLatestAssessmentResult(certificationCourseId) {
  const latestAssessmentResultBookshelf = await AssessmentResultBookshelf
    .query((qb) => {
      qb.join('assessments', 'assessments.id', 'assessment-results.assessmentId');
      qb.where('assessments.certificationCourseId', '=', certificationCourseId);
    })
    .orderBy('createdAt', 'desc')
    .fetch();

  return bookshelfToDomainConverter.buildDomainObject(AssessmentResultBookshelf, latestAssessmentResultBookshelf);
}

function _getBaseCertificationQuery() {
  return Bookshelf.knex
    .select({
      id: 'certification-courses.id',
      firstName: 'certification-courses.firstName',
      lastName: 'certification-courses.lastName',
      birthdate: 'certification-courses.birthdate',
      birthplace: 'certification-courses.birthplace',
      isPublished: 'certification-courses.isPublished',
      isCancelled: 'certification-courses.isCancelled',
      userId: 'certification-courses.userId',
      date: 'certification-courses.createdAt',
      verificationCode: 'certification-courses.verificationCode',
      deliveredAt: 'sessions.publishedAt',
      certificationCenter: 'sessions.certificationCenter',
      maxReachableLevelOnCertificationDate: 'certification-courses.maxReachableLevelOnCertificationDate',
    })
    .from('certification-courses')
    .join('assessments', 'assessments.certificationCourseId', 'certification-courses.id')
    .join('assessment-results', 'assessment-results.assessmentId', 'assessments.id')
    .join('sessions', 'sessions.id', 'certification-courses.sessionId');
}

function getNotFoundErrorMessage(id) {
  return `Certification attestation not found for ID ${id}`;
}

module.exports = {

  async publishCertificationCoursesBySessionId(sessionId) {
    const statuses = await getAssessmentResultsStatusesBySessionId(sessionId);
    if (statuses.includes('error') || statuses.includes('started')) {
      throw new CertificationCourseNotPublishableError();
    }
    await CertificationCourseBookshelf
      .where({ sessionId })
      .save({ isPublished: true }, { method: 'update', require: false });
  },

  async unpublishCertificationCoursesBySessionId(sessionId) {
    await CertificationCourseBookshelf
      .where({ sessionId })
      .save({ isPublished: false }, { method: 'update' });
  },

  async hasVerificationCode(id) {
    const certification = await CertificationCourseBookshelf
      .where({ id })
      .fetch({ require: false, columns: 'verificationCode' });

    return Boolean(certification.attributes.verificationCode);
  },

  async saveVerificationCode(id, verificationCode) {
    return CertificationCourseBookshelf
      .where({ id })
      .save({ verificationCode }, { method: 'update' });
  },

  async getCertificationAttestation({ id }) {
    const certificationCourseDTO = await _getBaseCertificationQuery()
      .where('certification-courses.id', '=', id)
      .first();

    if (!certificationCourseDTO) {
      throw new NotFoundError(getNotFoundErrorMessage(id));
    }

    const latestAssessmentResult = await _getLatestAssessmentResult(certificationCourseDTO.id);
    if (!latestAssessmentResult) {
      throw new NotFoundError(getNotFoundErrorMessage(id));
    }

    return new CertificationAttestation({
      ...certificationCourseDTO,
      pixScore: latestAssessmentResult.pixScore,
      status: latestAssessmentResult.status,
    });
  },
};
