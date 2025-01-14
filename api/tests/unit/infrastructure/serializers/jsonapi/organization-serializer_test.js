const { expect, domainBuilder } = require('../../../../test-helper');
const serializer = require('../../../../../lib/infrastructure/serializers/jsonapi/organization-serializer');

describe('Unit | Serializer | organization-serializer', () => {

  describe('#serialize', () => {

    it('should return a JSON API serialized organization', () => {
      // given
      const tags = [
        domainBuilder.buildTag({ id: 7, name: 'AEFE' }),
        domainBuilder.buildTag({ id: 44, name: 'PUBLIC' }),
      ];
      const organization = domainBuilder.buildOrganization({ email: 'sco.generic.account@example.net', tags });
      const meta = { some: 'meta' };

      // when
      const serializedOrganization = serializer.serialize(organization, meta);

      // then
      expect(serializedOrganization).to.deep.equal({
        data: {
          type: 'organizations',
          id: organization.id.toString(),
          attributes: {
            'name': organization.name,
            'type': organization.type,
            'logo-url': organization.logoUrl,
            'external-id': organization.externalId,
            'province-code': organization.provinceCode,
            'is-managing-students': organization.isManagingStudents,
            'credit': organization.credit,
            'can-collect-profiles': organization.canCollectProfiles,
            'email': organization.email,
          },
          relationships: {
            memberships: {
              links: {
                related: `/api/organizations/${organization.id}/memberships`,
              },
            },
            students: {
              links: {
                related: `/api/organizations/${organization.id}/students`,
              },
            },
            'target-profiles': {
              links: {
                related: `/api/organizations/${organization.id}/target-profiles`,
              },
            },
            'tags': {
              'data': [
                {
                  'id': tags[0].id.toString(),
                  'type': 'tags',
                },
                {
                  'id': tags[1].id.toString(),
                  'type': 'tags',
                },
              ],
            },
          },
        },
        'included': [
          {
            'attributes': {
              'id': tags[0].id,
              'name': tags[0].name,
            },
            'id': tags[0].id.toString(),
            'type': 'tags',
          },
          {
            'attributes': {
              'id': tags[1].id,
              'name': tags[1].name,
            },
            'id': tags[1].id.toString(),
            'type': 'tags',
          },
        ],
        meta: {
          some: 'meta',
        },
      });
    });

    it('should include serialized student data when organization has schoolingRegistration', () => {
      // given
      const organization = domainBuilder.buildOrganization.withSchoolingRegistrations();

      // when
      const serializedOrganization = serializer.serialize(organization);

      // then
      expect(serializedOrganization.data.relationships.students).to.be.ok;
    });
  });
});
