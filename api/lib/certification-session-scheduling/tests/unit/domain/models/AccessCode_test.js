const { AccessCode } = require('../../../../domain/models/Session');
const { expect } = require('../../../../../../tests/test-helper.js');

describe('Unit | Domain | Models | AccessCode', function() {

  context('#validate', () => {

    let validAttributes;

    beforeEach(() => {
      validAttributes = {
        value: 'ANNE66',
      };
    });

    it('passes when attributes are all valid', () => {
      // when / then
      expect(() => new AccessCode(validAttributes)).not.to.throw();
    });

    [
      '1NNE66',
      'A1NE66',
      'AN1E66',
      'ANN166',
      'ANNEA6',
      'ANNE6A',
    ].forEach((wrongValue) => {
      it(`rejects when code does not consist of 4 letters at the beginning followed by 2 numbers ${wrongValue}`, () => {
        // when / then
        expect(() => new AccessCode({
          ...validAttributes,
          value: wrongValue,
        })).to.throw();
      });
    });
  });
});
