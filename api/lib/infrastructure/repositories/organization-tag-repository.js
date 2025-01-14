const BookshelfOrganizationTag = require('../orm-models/OrganizationTag');
const Bookshelf = require('../bookshelf');
const bookshelfUtils = require('../utils/knex-utils');
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
const { AlreadyExistingEntityError } = require('../../domain/errors');
const { omit } = require('lodash');
const DomainTransaction = require('../DomainTransaction');

module.exports = {

  async create(organizationTag) {
    try {
      const organizationTagToCreate = omit(organizationTag, 'id');
      const bookshelfOrganizationTag = await new BookshelfOrganizationTag(organizationTagToCreate).save();
      return bookshelfToDomainConverter.buildDomainObject(BookshelfOrganizationTag, bookshelfOrganizationTag);
    } catch (err) {
      if (bookshelfUtils.isUniqConstraintViolated(err)) {
        throw new AlreadyExistingEntityError(`The tag ${organizationTag.tagId} already exists for the organization ${organizationTag.organizationId}.`);
      }
      throw err;
    }
  },

  async batchCreate(organizationsTags, domainTransaction = DomainTransaction.emptyTransaction()) {
    return Bookshelf.knex.batchInsert('organization-tags', organizationsTags).transacting(domainTransaction.knexTransaction);
  },

  async isExistingByOrganizationIdAndTagId({ organizationId, tagId }) {
    const organizationTag = await BookshelfOrganizationTag
      .where({ organizationId, tagId })
      .fetch({ require: false });

    return !!organizationTag;
  },
};
