const Bookshelf = require('../bookshelf');
const bookshelfToDomainConverter = require('../utils/bookshelf-to-domain-converter');
const BookshelfBadgeAcquisition = require('../orm-models/BadgeAcquisition');
const DomainTransaction = require('../DomainTransaction');

module.exports = {

  async create(badgeAcquisitionsToCreate = [], domainTransaction = DomainTransaction.emptyTransaction()) {
    const knexConn = domainTransaction.knexTransaction || Bookshelf.knex;
    const results = await knexConn('badge-acquisitions')
      .insert(badgeAcquisitionsToCreate, 'id');
    return results;
  },

  async getAcquiredBadgeIds({ badgeIds, userId }) {
    const collectionResult = await BookshelfBadgeAcquisition
      .where({ userId })
      .where('badgeId', 'in', badgeIds)
      .fetchAll({ columns: ['badge-acquisitions.badgeId'], require: false });
    return collectionResult.map((obj) => obj.attributes.badgeId);
  },

  async getCampaignAcquiredBadgesByUsers({ campaignId, userIds }) {
    const results = await BookshelfBadgeAcquisition
      .query((qb) => {
        qb.join('badges', 'badges.id', 'badge-acquisitions.badgeId');
        qb.join('campaigns', 'campaigns.targetProfileId', 'badges.targetProfileId');
        qb.where('campaigns.id', '=', campaignId);
        qb.where('badge-acquisitions.userId', 'IN', userIds);
      })
      .fetchAll({
        withRelated: ['badge'],
        require: false,
      });

    const badgeAcquisitions = results.map((result) => bookshelfToDomainConverter.buildDomainObject(BookshelfBadgeAcquisition, result));

    const acquiredBadgesByUsers = {};
    for (const badgeAcquisition of badgeAcquisitions) {
      const { userId, badge } = badgeAcquisition;
      if (acquiredBadgesByUsers[userId]) {
        acquiredBadgesByUsers[userId].push(badge);
      } else {
        acquiredBadgesByUsers[userId] = [badge];
      }
    }
    return acquiredBadgesByUsers;
  },

  async findCertifiable({ userId, domainTransaction = DomainTransaction.emptyTransaction() }) {
    const results = await BookshelfBadgeAcquisition
      .query((qb) => {
        qb.join('badges', 'badges.id', 'badge-acquisitions.badgeId');
        qb.where('badge-acquisitions.userId', '=', userId);
        qb.where('badges.isCertifiable', '=', true);
      })
      .fetchAll({
        withRelated: ['badge', 'badge.badgePartnerCompetences', 'badge.badgeCriteria'],
        require: false,
        transacting: domainTransaction.knexTransaction,
      });

    return bookshelfToDomainConverter.buildDomainObjects(BookshelfBadgeAcquisition, results);
  },
};
