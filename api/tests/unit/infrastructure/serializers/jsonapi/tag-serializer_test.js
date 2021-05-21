const {
  expect
} = require('../../../../test-helper');
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/tag-serializer');

describe('Unit | Serializer | JSONAPI | tag-serializer', () => {

  describe('#serialize', function() {

    it('should convert to JSON', () => {
      // given
      const tag = { id: 1, name: 'TAG1', isAssigned: false };

      const expectedSerializedTag = {
        data: {
          attributes: {
            name: tag.name,
            'is-assigned': tag.isAssigned,
          },
          id: tag.id.toString(),
          type: 'tags',
        },
      };

      // when
      const json = serializer.serialize(tag);

      // then
      expect(json).to.deep.equal(expectedSerializedTag);
    });

  });

});
