const SessionValidator = require('../../../../domain/models/SessionValidator');
const { Session } = require('../../../../domain/models/Session');
const { expect } = require('../../../../../../tests/test-helper.js');

describe('Unit | Domain | Models | SessionValidator', () => {

  describe('#validate', () => {

    let validAttributes;

    beforeEach(() => {
      validAttributes = {
        certificationCenterId: 123,
        certificationCenter: 'Centre des Anne-Etoiles', // vieillerie, ne plus l'écrire en BDD
        accessCode: 'AZER12',
        address: '3 rue des Églantines',
        examiner: 'Big Brother',
        room: 'A20',
        date: '2021-01-01',
        time: '12:00:00',
        description: 'Session de certification',
      };
    });

    it('passes when attributes are all valid', () => {
      // given
      const session = new Session(validAttributes);

      // when / then
      expect(() => SessionValidator.validate(session)).not.to.throw();
    });

    it('fails when certificationCenterId is missing', () => {
      [undefined, null].forEach((missingValue) => {
        // given
        const session = new Session({
          ...validAttributes,
          certificationCenterId: missingValue,
        });

        // when / then
        expect(() => SessionValidator.validate(session)).to.throw();
      });
    });
  });
});
