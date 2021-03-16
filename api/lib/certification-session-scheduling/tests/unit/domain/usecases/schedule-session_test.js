const { expect, sinon, catchErr } = require('../../../../../../tests/test-helper');
const { Session } = require('../../../../domain/models/Session');

const { scheduleSession, ReferentIsNotAMemberOfCertificationCenterError } = require('../../../../domain/usecases/schedule-session.js');

// - la date de début ne peut pas être dans le passé (dans un deuxième temps)

describe('Unit | Domain | Usecases | schedule-session', () => {

  context('when pix certif member is a member of the certification center', () => {

    it('schedules a session', async () => {
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
        .resolves(['1234']);

      const sessionRepository = {
        save: sinon.stub(),
      };
      const dependencies = {
        sessionRepository,
        certificationCenterMembershipRepository,
      };

      const session = new Session({
        certificationCenterId: 27,
        address: '11 avenue des peupliers',
        examiner: 'Juste Leblanc',
        room: 'Salle 101',
        date: '2021-11-21',
        time: '12:21',
        description: 'Super session !',
      });

      // when
      await scheduleSession({
        ...command,
        ...dependencies,
      });

      // then
      expect(sessionRepository.save).to.have.been.calledWith(session);
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
