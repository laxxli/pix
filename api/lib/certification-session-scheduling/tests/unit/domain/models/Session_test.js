const { Session } = require('../../../../domain/models/Session');
const { expect } = require('../../../../../../tests/test-helper.js');

describe('Unit | Domain | Models | Session', () => {

  describe('#schedule ', () => {
    it('should schedule a session if schedule date is in the future in the same timezone', () => {
      // given / when
      const scheduledSession = Session.schedule({
        certificationCenterId: 27,
        address: '11 avenue des peupliers',
        examiner: 'Juste Leblanc',
        room: 'Salle 101',
        date: '2021-11-21',
        time: '12:21',
        description: 'Super session !',
      });

      // then
      expect(scheduledSession).to.deep.equal({
        certificationCenterId: 27,
        address: '11 avenue des peupliers',
        examiner: 'Juste Leblanc',
        room: 'Salle 101',
        date: '2021-11-21',
        time: '12:21',
        description: 'Super session !',
      });
    });
  });
});
