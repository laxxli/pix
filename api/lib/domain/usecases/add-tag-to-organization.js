const { AlreadyExistingEntityError } = require('../errors');
const OrganizationTag = require('../models/OrganizationTag');

module.exports = async function addTagToOrganization({
  tagId,
  organizationId,
  organizationTagRepository,
  organizationRepository,
  tagRepository,
}) {
  await organizationRepository.get(organizationId);
  await tagRepository.get(tagId);

  const isTagAlreadyAssignedToOrganization = await organizationTagRepository.isExistingByOrganizationIdAndTagId({ organizationId, tagId });
  if (isTagAlreadyAssignedToOrganization) {
    throw new AlreadyExistingEntityError('Ce tag est déjà attribué à l\'organisation.');
  }
  const organizationTag = new OrganizationTag({ organizationId, tagId });

  return organizationTagRepository.create(organizationTag);
};
