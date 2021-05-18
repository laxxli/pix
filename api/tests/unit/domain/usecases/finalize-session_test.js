const {
  sinon,
  expect,
  catchErr,
  domainBuilder,
} = require('../../../test-helper');

const finalizeSession = require('../../../../lib/domain/usecases/finalize-session');
const { SessionAlreadyFinalizedError, InvalidCertificationReportForFinalization } = require('../../../../lib/domain/errors');
const { CertificationIssueReportSubcategories, CertificationIssueReportCategories } = require('../../../../lib/domain/models/CertificationIssueReportCategory');
const SessionFinalized = require('../../../../lib/domain/events/SessionFinalized');
const AnswerStatus = require('../../../../lib/domain/models/AnswerStatus');

describe('Unit | UseCase | finalize-session', () => {

  let sessionId;
  let updatedSession;
  let examinerGlobalComment;
  let sessionRepository;
  let certificationReportRepository;
  let certificationIssueReportRepository;
  let certificationAssessmentRepository;

  beforeEach(async () => {
    sessionId = 'dummy session id';
    updatedSession = domainBuilder.buildSession({
      id: sessionId,
      examinerGlobalComment,
      finalizedAt: new Date(),
    });
    examinerGlobalComment = 'It was a fine session my dear.';
    sessionRepository = {
      finalize: sinon.stub(),
      isFinalized: sinon.stub(),
    };
    certificationReportRepository = {
      finalizeAll: sinon.stub(),
    };
    certificationAssessmentRepository = {
      getByCertificationCourseId: sinon.stub(),
      save: sinon.stub(),
    };
    certificationIssueReportRepository = { findByCertificationCourseId: sinon.stub() };
  });

  context('When the session status is already finalized', () => {

    beforeEach(() => {
      sessionRepository.isFinalized.withArgs(sessionId).resolves(true);
    });

    it('should throw a SessionAlreadyFinalizedError error', async () => {
      // when
      const err = await catchErr(finalizeSession)({
        sessionId,
        examinerGlobalComment,
        sessionRepository,
        certificationReportRepository,
      });

      // then
      expect(err).to.be.instanceOf(SessionAlreadyFinalizedError);
    });

  });

  context('When the session status is not finalized yet ', () => {
    let certificationReports;
    context('When the certificationReports are not valid', () => {
      beforeEach(() => {
        const courseWithoutHasSeenLastScreen = domainBuilder.buildCertificationReport();
        delete courseWithoutHasSeenLastScreen.hasSeenEndTestScreen;
        certificationReports = [courseWithoutHasSeenLastScreen];
      });

      it('should throw an InvalidCertificationReportForFinalization error', async () => {
        // when
        const err = await catchErr(finalizeSession)({
          sessionId,
          examinerGlobalComment,
          sessionRepository,
          certificationReports,
          certificationReportRepository,
        });

        // then
        expect(err).to.be.instanceOf(InvalidCertificationReportForFinalization);
      });
    });

    context('When the certificationReports are valid', () => {
      const now = new Date('2019-01-01T05:06:07Z');
      let clock;

      beforeEach(() => {
        clock = sinon.useFakeTimers(now);
        const validReportForFinalization = domainBuilder.buildCertificationReport({
          examinerComment: 'signalement sur le candidat',
          hasSeenEndTestScreen: false,
        });
        certificationReports = [validReportForFinalization];
        sessionRepository.isFinalized.withArgs(sessionId).resolves(false);
        certificationReportRepository.finalizeAll.withArgs(certificationReports).resolves();
        sessionRepository.finalize.withArgs({
          id: sessionId,
          examinerGlobalComment,
          finalizedAt: now,
        }).resolves(updatedSession);
      });

      afterEach(() => {
        clock.restore();
      });

      it('should finalize session with expected arguments', async () => {
        // given
        clock = sinon.useFakeTimers(now);
        const validReportForFinalization = domainBuilder.buildCertificationReport({
          examinerComment: 'signalement sur le candidat',
          hasSeenEndTestScreen: false,
        });
        certificationReports = [validReportForFinalization];
        sessionRepository.isFinalized.withArgs(sessionId).resolves(false);
        certificationReportRepository.finalizeAll.withArgs(certificationReports).resolves();
        sessionRepository.finalize.withArgs({
          id: sessionId,
          examinerGlobalComment,
          finalizedAt: now,
        }).resolves(updatedSession);
        certificationIssueReportRepository.findByCertificationCourseId.withArgs(validReportForFinalization.certificationCourseId).resolves([]);

        // when
        await finalizeSession({
          sessionId,
          examinerGlobalComment,
          sessionRepository,
          certificationReports,
          certificationReportRepository,
          certificationIssueReportRepository,
          certificationAssessmentRepository,
        });

        // then
        expect(sessionRepository.finalize.calledWithExactly({
          id: sessionId,
          examinerGlobalComment,
          finalizedAt: now,
        })).to.be.true;
      });

      it('raises a session finalized event', async () => {
        // given
        const updatedSession = domainBuilder.buildSession({
          finalizedAt: new Date('2020-01-01T14:00:00Z'),
          examinerGlobalComment: 'an examiner comment',
          certificationCenter: 'a certification center name',
          date: '2019-12-12',
          time: '16:00:00',
        });
        clock = sinon.useFakeTimers(now);
        const validReportForFinalization = domainBuilder.buildCertificationReport({
          examinerComment: 'signalement sur le candidat',
          hasSeenEndTestScreen: false,
        });
        certificationReports = [validReportForFinalization];
        sessionRepository.isFinalized.withArgs(sessionId).resolves(false);
        certificationReportRepository.finalizeAll.withArgs(certificationReports).resolves();
        sessionRepository.finalize.withArgs({
          id: sessionId,
          examinerGlobalComment,
          finalizedAt: now,
        }).resolves(updatedSession);
        certificationIssueReportRepository.findByCertificationCourseId.withArgs(validReportForFinalization.certificationCourseId).resolves([]);

        // when
        const event = await finalizeSession({
          sessionId,
          examinerGlobalComment,
          sessionRepository,
          certificationReports,
          certificationReportRepository,
          certificationIssueReportRepository,
          certificationAssessmentRepository,
        });

        // then
        expect(event).to.be.an.instanceof(SessionFinalized);
        expect(event).to.deep.equal(new SessionFinalized({
          sessionId,
          finalizedAt: new Date('2020-01-01T14:00:00Z'),
          hasExaminerGlobalComment: true,
          certificationCenterName: 'a certification center name',
          sessionDate: '2019-12-12',
          sessionTime: '16:00:00',
        }));
      });

      context('when certifications issue reports concerns auto-neutralizable challenges', () => {

        it('should neutralize auto-neutralizable challenges', async () => {
          // given
          const challengeToBeNeutralized1 = domainBuilder.buildCertificationChallenge({ challengeId: 'recChal123', isNeutralized: false });
          const challengeToBeNeutralized2 = domainBuilder.buildCertificationChallenge({ challengeId: 'recChal456', isNeutralized: false });
          const challengeNotToBeNeutralized = domainBuilder.buildCertificationChallenge({ challengeId: 'recChal789', isNeutralized: false });
          const certificationAssessment = domainBuilder.buildCertificationAssessment({
            certificationAnswersByDate: [
              domainBuilder.buildAnswer({ challengeId: 'recChal123', result: AnswerStatus.SKIPPED }),
              domainBuilder.buildAnswer({ challengeId: 'recChal456', result: AnswerStatus.KO }),
              domainBuilder.buildAnswer({ challengeId: 'recChal789', result: AnswerStatus.OK }),
            ],
            certificationChallenges: [
              challengeToBeNeutralized1,
              challengeToBeNeutralized2,
              challengeNotToBeNeutralized,
            ],
          });
          const certificationReport = domainBuilder.buildCertificationReport();
          const certificationIssueReport1 = domainBuilder.buildCertificationIssueReport({ category: CertificationIssueReportCategories.IN_CHALLENGE, subcategory: CertificationIssueReportSubcategories.WEBSITE_BLOCKED, questionNumber: 1 });
          const certificationIssueReport2 = domainBuilder.buildCertificationIssueReport({ category: CertificationIssueReportCategories.IN_CHALLENGE, subcategory: CertificationIssueReportSubcategories.SOFTWARE_NOT_WORKING, questionNumber: 2 });
          const certificationIssueReport3 = domainBuilder.buildCertificationIssueReport({ category: CertificationIssueReportCategories.IN_CHALLENGE, subcategory: CertificationIssueReportSubcategories.EMBED_NOT_WORKING, questionNumber: 3 });
          certificationIssueReportRepository.findByCertificationCourseId.withArgs(certificationReport.certificationCourseId).resolves([ certificationIssueReport1, certificationIssueReport2, certificationIssueReport3 ]);
          certificationAssessmentRepository.getByCertificationCourseId.withArgs({ certificationCourseId: certificationReport.certificationCourseId }).resolves(certificationAssessment);
          sinon.stub(certificationAssessment, 'neutralizeChallengeByNumberIfKoOrSkipped');
          certificationAssessmentRepository.save.resolves();

          // when
          await finalizeSession({
            sessionId,
            examinerGlobalComment,
            certificationReports: [certificationReport],
            sessionRepository,
            certificationReportRepository,
            certificationIssueReportRepository,
            certificationAssessmentRepository,
          });

          // then
          expect(certificationAssessment.neutralizeChallengeByNumberIfKoOrSkipped).to.have.been.calledWith(1);
          expect(certificationAssessment.neutralizeChallengeByNumberIfKoOrSkipped).to.have.been.calledWith(2);
          expect(certificationAssessment.neutralizeChallengeByNumberIfKoOrSkipped).not.to.have.been.calledWith(3);
          expect(certificationAssessmentRepository.save).to.have.been.calledWith(certificationAssessment);
        });
      });
    });
  });
});
