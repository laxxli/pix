const Session = require('../../../../domain/models/Session');
const { expect } = require('../../../../../../tests/test-helper.js');

describe('Unit | Domain | Models | Session', () => {

  it('should build Session with corrects properties', () => {
    // given / when
    const session = new Session({
      certificationCenterId: 27,
      address: '11 avenue des peupliers',
      examiner: 'Juste Leblanc',
      room: 'Salle 101',
      date: new Date('2021-11-21'),
      time: '12:21',
      description: 'Super session !',
    });

    // then
    expect(session).to.deep.equal({
      certificationCenterId: 27,
      address: '11 avenue des peupliers',
      examiner: 'Juste Leblanc',
      room: 'Salle 101',
      date: new Date('2021-11-21'),
      time: '12:21',
      description: 'Super session !',
    });
  });
});