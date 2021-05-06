const { Session } = require('../../../../domain/models/Session');
const { AccessCode } = require('../../../../domain/models/AccessCode');
const random = require('../../../../infrastructure/random');
const { expect, sinon } = require('../../../../../../tests/test-helper.js');
const buildSession = require('../../../tooling/buildSession');

describe('Unit | Domain | Models | Session', () => {

  describe('#static schedule ', () => {

    it('should schedule a session if schedule date is in the future in the same timezone', () => {
      // given
      const pickOneFromStub = sinon.stub(random, 'pickOneFrom');
      pickOneFromStub.onCall(0).returns('A');
      pickOneFromStub.onCall(1).returns('B');
      pickOneFromStub.onCall(2).returns('C');
      pickOneFromStub.onCall(3).returns('D');
      pickOneFromStub.onCall(4).returns('6');
      pickOneFromStub.onCall(5).returns('6');

      // when
      const scheduledSession = Session.schedule({
        certificationCenterId: 27,
        certificationCenterName: 'Le pays des Barbapapa',
        address: '11 avenue des peupliers',
        examiner: 'Juste Leblanc',
        room: 'Salle 101',
        date: '2021-11-21',
        time: '12:21',
        description: 'Super session !',
      }, pickOneFromStub);

      // then
      const expectedScheduledSession = buildSession.withAccessCode({
        id: null,
        certificationCenterId: 27,
        certificationCenterName: 'Le pays des Barbapapa',
        address: '11 avenue des peupliers',
        examiner: 'Juste Leblanc',
        room: 'Salle 101',
        date: '2021-11-21',
        time: '12:21',
        description: 'Super session !',
        accessCodeValue: 'ABCD66',
      });
      expect(scheduledSession).to.deep.equal(expectedScheduledSession);
    });
  });

  describe('#toDTO ', () => {

    it('should return the session as DTO', () => {
      // given
      const session = buildSession.withAccessCode({
        id: 123,
        certificationCenterId: 456,
        certificationCenterName: 'Centre de poux libérés',
        accessCodeValue: 'TOTO78',
        address: '1 rue des fruits exotiques',
        examiner: 'Clément',
        room: '2A',
        date: '2021-01-03',
        time: '14:30',
        description: 'Le mec est chaud',
      });

      // when
      const sessionDTO = session.toDTO();

      // then
      expect(sessionDTO).to.deep.equal({
        id: 123,
        certificationCenterId: 456,
        certificationCenterName: 'Centre de poux libérés',
        accessCode: 'TOTO78',
        address: '1 rue des fruits exotiques',
        examiner: 'Clément',
        room: '2A',
        date: '2021-01-03',
        time: '14:30',
        description: 'Le mec est chaud',
      });
    });
  });
});

describe('Unit | Domain | Models | AccessCode', () => {

  describe('#static generate ', () => {

    it('should return an AccessCode with a generated value', () => {
      // when
      const accessCode = AccessCode.generate(random.pickOneFrom);

      // then
      expect(accessCode).to.be.instanceOf(AccessCode);
    });
  });
});
