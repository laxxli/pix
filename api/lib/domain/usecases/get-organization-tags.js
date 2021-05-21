const getOrganizationTags = async function({
  organizationId,
  organizationTagRepository,
  tagRepository,
}) {

  const tags = await tagRepository.findAll();
  const organizationTags = await organizationTagRepository.findTagIdsByOrganizationId({organizationId});

  const tagsWithIsAssignedProperty = tags.map((tag) => {
    const isAssigned = organizationTags.includes(tag.id);
    return { id: tag.id, name: tag.name, isAssigned };
  });

  return tagsWithIsAssignedProperty;
};

module.exports = getOrganizationTags;
