const BookshelfOrganizationTag = require('../orm-models/OrganizationTag');
const Bookshelf = require('../bookshelf');
const knexUtils = require('../utils/knex-utils');
const { knex } = require('../../../db/knex-database-connection');

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
      if (knexUtils.isUniqConstraintViolated(err)) {
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

  async findTagIdsByOrganizationId({ organizationId }) {
    return knex.from('organization-tags').where({organizationId}).pluck('tagId');
  },
};
