const { Session } = require('../../../../domain/models/Session');
const { AccessCode } = require('../../../../domain/models/AccessCode');
const random = require('../../../../infrastructure/random');
const { expect, sinon } = require('../../../../../../tests/test-helper.js');

describe('Unit | Domain | Models | Session', () => {

  describe('#schedule ', () => {

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
      const expectedAccessCode = new AccessCode({ value: 'ABCD66' });
      const expectedScheduledSession = new Session({
        certificationCenterId: 27,
        certificationCenterName: 'Le pays des Barbapapa',
        address: '11 avenue des peupliers',
        examiner: 'Juste Leblanc',
        room: 'Salle 101',
        date: '2021-11-21',
        time: '12:21',
        description: 'Super session !',
        accessCode: expectedAccessCode,
      });
      expect(scheduledSession).to.deep.equal(expectedScheduledSession);
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
