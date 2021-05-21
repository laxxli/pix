const {
  expect,
  sinon,
  domainBuilder,
} = require('../../../test-helper');

const getOrganizationTags = require('../../../../lib/domain/usecases/get-organization-tags');

describe('Unit | UseCase | get-organization-tags', () => {

  let tagRepository;
  let organizationTagRepository;

  beforeEach(() => {
    tagRepository = {
      findAll: sinon.stub(),
    };
    organizationTagRepository = {
      findTagIdsByOrganizationId: sinon.stub(),
    };
  });

  it('should return all tags not assigned to organization', async () => {
    // given
    const organizationId = 123;
    const tagNotAssignedToOrganization1 = domainBuilder.buildTag({ id: 1, name: 'TAG1' });
    const tagNotAssignedToOrganization2 = domainBuilder.buildTag({ id: 2, name: 'TAG2' });
    const tagAssignedToOrganization = domainBuilder.buildTag({ id: 3, name: 'TAG3' });
    const tags = [ tagNotAssignedToOrganization1, tagNotAssignedToOrganization2, tagAssignedToOrganization ];

    tagRepository.findAll.returns(tags);
    organizationTagRepository.findTagIdsByOrganizationId.withArgs(organizationId).resolves([ tagAssignedToOrganization.id ]);

    // when
    const tagsWithIsAssignedProperty = await getOrganizationTags({ organizationId, tagRepository, organizationTagRepository });

    // then
    const tagNotAssignedToOrganizationWithIsAssignedProperty1 = { id: 1, name: 'TAG1', isAssigned: false };
    const tagNotAssignedToOrganizationWithIsAssignedProperty2 = { id: 2, name: 'TAG2', isAssigned: false };
    expect(tagsWithIsAssignedProperty).to.deep.includes(tagNotAssignedToOrganizationWithIsAssignedProperty1);
    expect(tagsWithIsAssignedProperty).to.deep.includes(tagNotAssignedToOrganizationWithIsAssignedProperty2);
  });

  it('should return all tags assigned to organization', async () => {
    // given
    const organizationId = 123;
    const tagAssignedToOrganization1 = domainBuilder.buildTag({ id: 1, name: 'TAG1' });
    const tagAssignedToOrganization2 = domainBuilder.buildTag({ id: 2, name: 'TAG2' });
    const tagNotAssignedToOrganization = domainBuilder.buildTag({ id: 3, name: 'TAG3' });
    const tags = [ tagAssignedToOrganization1, tagAssignedToOrganization2, tagNotAssignedToOrganization ];

    tagRepository.findAll.returns(tags);
    organizationTagRepository.findTagIdsByOrganizationId.withArgs(organizationId).resolves([
      tagAssignedToOrganization1.id,
      tagAssignedToOrganization2.id]);

    // when
    const tagsWithIsAssignedProperty = await getOrganizationTags({ organizationId, tagRepository, organizationTagRepository });

    // then
    const tagAssignedToOrganizationWithIsAssignedProperty1 = { id: 1, name: 'TAG1', isAssigned: true };
    const tagAssignedToOrganizationWithIsAssignedProperty2 = { id: 2, name: 'TAG2', isAssigned: true };
    expect(tagsWithIsAssignedProperty).to.deep.includes(tagAssignedToOrganizationWithIsAssignedProperty1);
    expect(tagsWithIsAssignedProperty).to.deep.includes(tagAssignedToOrganizationWithIsAssignedProperty2);
  });

  it('should return an empty array when no tags found', async () => {
    // given
    const organizationId = 123;
    tagRepository.findAll.returns([]);
    organizationTagRepository.findTagIdsByOrganizationId.withArgs(organizationId).resolves([]);

    // when
    const tagsWithIsAssignedProperty = await getOrganizationTags({ organizationId, tagRepository, organizationTagRepository });

    // then
    expect(tagsWithIsAssignedProperty).to.be.an('array').that.is.empty;
  });

});
