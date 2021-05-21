const {
  expect,
  generateValidRequestAuthorizationHeader,
  insertUserWithRolePixMaster,
  databaseBuilder,
} = require('../../../test-helper');

const createServer = require('../../../../server');

describe('Acceptance | Route | organization-router', () => {

  describe('GET /api/admin/organizations/{id}/tags', () => {

    it.only('should return a list of tags with 200 HTTP status code', async () => {
      // given
      const server = await createServer();
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const tag1 = databaseBuilder.factory.buildTag({ name: 'TAG1' });
      const tag2 = databaseBuilder.factory.buildTag({ name: 'TAG2' });
      databaseBuilder.factory.buildOrganizationTag({ organizationId, tagId: tag1.id });
      await databaseBuilder.commit();

      const userId = (await insertUserWithRolePixMaster()).id;

      const options = {
        method: 'GET',
        url: '/api/admin/organizations/{id}/tags',
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };

      // when
      const response = await server.inject(options);

      // then
      const expectedTags = [
        {
          'attributes': {
            'name': tag1.name,
            'is-assigned': true,
          },
          'id': tag1.id.toString(),
          'type': 'tags',
        },
        {
          'attributes': {
            'name': tag2.name,
            'is-assigned': false,
          },
          'id': tag2.id.toString(),
          'type': 'tags',
        },
      ];
      expect(response.statusCode).to.equal(200);
      expect(response.result.data).to.deep.equal(expectedTags);
    });

    // it('should return 403 HTTP status code when the user authenticated is not PixMaster', async () => {
    //   // given
    //   const server = await createServer();
    //   const userId = databaseBuilder.factory.buildUser().id;
    //   await databaseBuilder.commit();

    //   const options = {
    //     method: 'GET',
    //     url: '/api/admin/organizations/{id}/tags',
    //     headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
    //   };

    //   // when
    //   const response = await server.inject(options);

    //   // then
    //   expect(response.statusCode).to.equal(403);
    // });

  });

});
