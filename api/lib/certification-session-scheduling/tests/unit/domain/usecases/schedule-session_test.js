const { expect, sinon, catchErr } = require('../../../../../../tests/test-helper');
const { Session, AccessCode } = require('../../../../domain/models/Session');
const CertificationCenterMembership = require('../../../../domain/models/CertificationCenterMembership');
const { CertificationCenter } = require('../../../../domain/models/CertificationCenter');
const { scheduleSession, ReferentIsNotAMemberOfCertificationCenterError } = require('../../../../domain/usecases/schedule-session.js');

describe('Unit | Domain | Usecases | schedule-session', () => {

  context('when pix certif member is a member of the certification center', () => {

    it('schedules a session', async () => {
      // given
      const certificationCenterMembershipRepository = {
        find: sinon.stub(),
      };
      const sessionRepository = {
        save: sinon.stub(),
      };
      const certificationCenterRepository = {
        get: sinon.stub(),
      };
      const random = {
        pickOneFrom: sinon.stub(),
      };
      random.pickOneFrom.onCall(0).returns('A');
      random.pickOneFrom.onCall(1).returns('B');
      random.pickOneFrom.onCall(2).returns('C');
      random.pickOneFrom.onCall(3).returns('D');
      random.pickOneFrom.onCall(4).returns('6');
      random.pickOneFrom.onCall(5).returns('6');
      const dependencies = {
        sessionRepository,
        certificationCenterMembershipRepository,
        certificationCenterRepository,
        random,
      };
      const command = {
        certificationCenterId: 27,
        address: '11 avenue des peupliers',
        examiner: 'Juste Leblanc',
        room: 'Salle 101',
        date: '2021-11-21',
        time: '12:21',
        description: 'Super session !',
        referentId: 1234,
      };

      const certificationCenterMembership = new CertificationCenterMembership({ userId: 1234, certificationCenterId: 27 });
      certificationCenterMembershipRepository.find
        .withArgs({ referentId: 1234, certificationCenterId: 27 })
        .resolves([certificationCenterMembership]);
      const certificationCenter = new CertificationCenter({ name: 'La France !' });
      certificationCenterRepository.get
        .withArgs(27)
        .resolves(certificationCenter);

      const expectedScheduledSession = new Session({
        certificationCenterId: 27,
        certificationCenterName: 'La France !',
        address: '11 avenue des peupliers',
        examiner: 'Juste Leblanc',
        room: 'Salle 101',
        date: '2021-11-21',
        time: '12:21',
        description: 'Super session !',
        accessCode: new AccessCode({ value: 'ABCD66' }),
      });

      // when
      await scheduleSession({
        ...command,
        ...dependencies,
      });

      // then
      expect(sessionRepository.save).to.have.been.calledWith(expectedScheduledSession);
    });
  });

  context('when pix certif member is not a member of the certification center', () => {

    it('does not schedule the session', async () => {
      // given
      const command = {
        certificationCenterId: 27,
        address: '11 avenue des peupliers',
        examiner: 'Juste Leblanc',
        room: 'Salle 101',
        date: '2021-11-21',
        time: '12:21',
        description: 'Super session !',
        referentId: 1234,
      };

      const certificationCenterMembershipRepository = {
        find: sinon.stub(),
      };

      certificationCenterMembershipRepository.find
        .withArgs({ referentId: 1234, certificationCenterId: 27 })
        .resolves([]);

      const sessionRepository = {
        save: sinon.stub(),
      };

      const dependencies = {
        sessionRepository,
        certificationCenterMembershipRepository,
      };

      // when
      const error = await catchErr(scheduleSession)({
        ...command,
        ...dependencies,
      });

      // then
      expect(error).to.be.an.instanceof(ReferentIsNotAMemberOfCertificationCenterError);
    });
  });
});
