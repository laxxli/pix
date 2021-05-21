const {
  expect,
  sinon,
  domainBuilder,
  catchErr,
} = require('../../../test-helper');

const addTagToOrganization = require('../../../../lib/domain/usecases/add-tag-to-organization');
const OrganizationTag = require('../../../../lib/domain/models/OrganizationTag');
const { AlreadyExistingEntityError } = require('../../../../lib/domain/errors');

describe('Unit | UseCase | add-tag-to-organization', () => {

  let organizationTagRepository;
  let organizationRepository;
  let tagRepository;

  beforeEach(() => {
    organizationTagRepository = {
      isExistingByOrganizationIdAndTagId: sinon.stub(),
      create: sinon.stub(),
    };
    organizationRepository = {
      get: sinon.stub(),
    };
    tagRepository = {
      get: sinon.stub(),
    };
  });

  context('when tag already exists to organization', () => {

    it('should throw a AlreadyExistingEntityError', async () => {
      // given
      const organization = domainBuilder.buildOrganization();
      const tag = domainBuilder.buildTag();

      organizationRepository.get.withArgs(organization.id).resolves(organization);
      tagRepository.get.withArgs(tag.id).resolves(tag);
      organizationTagRepository.isExistingByOrganizationIdAndTagId.withArgs({ organizationId: organization.id, tagId: tag.id }).resolves(true);

      // when
      const error = await catchErr(addTagToOrganization)({
        tagId: tag.id,
        organizationId: organization.id,
        organizationTagRepository,
        organizationRepository,
        tagRepository,
      });

      // then
      expect(error).to.be.instanceOf(AlreadyExistingEntityError);
      expect(organizationTagRepository.create).to.have.not.been.called;
    });
  });

  context('when tag not already exists to organization', () => {

    it('should add tag to organization', async () => {
      // given
      const organization = domainBuilder.buildOrganization();
      const tag = domainBuilder.buildTag();
      const organizationTag = new OrganizationTag({ organizationId: organization.id, tagId: tag.id });
      const insertedOrganizationTag = new OrganizationTag({ id: 1, organizationId: organization.id, tagId: tag.id });

      organizationRepository.get.withArgs(organization.id).resolves(organization);
      tagRepository.get.withArgs(tag.id).resolves(tag);
      organizationTagRepository.isExistingByOrganizationIdAndTagId.withArgs({ organizationId: organization.id, tagId: tag.id }).resolves(false);
      organizationTagRepository.create.withArgs(organizationTag).resolves(insertedOrganizationTag);

      // when
      const result = await addTagToOrganization({
        tagId: tag.id,
        organizationId: organization.id,
        organizationTagRepository,
        organizationRepository,
        tagRepository,
      });

      // then
      expect(result).to.deep.equal(insertedOrganizationTag);
    });
  });
});
