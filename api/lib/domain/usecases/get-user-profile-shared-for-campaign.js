const _ = require('lodash');

const Scorecard = require('../models/Scorecard');
const SharedProfileForCampaign = require('../models/SharedProfileForCampaign');
const { NoCampaignParticipationForUserAndCampaign } = require('../errors');

module.exports = async function getUserProfileSharedForCampaign({
  userId,
  campaignId,
  campaignParticipationRepository,
  campaignRepository,
  knowledgeElementRepository,
  competenceRepository,
}) {
  const campaignParticipation = await campaignParticipationRepository.findOneByCampaignIdAndUserId({ campaignId, userId });

  if (!campaignParticipation) {
    throw new NoCampaignParticipationForUserAndCampaign();
  }

  const { multipleSendings: campaignAllowsRetry } = await campaignRepository.get(campaignId);
  const [knowledgeElementsGroupedByCompetenceId, competencesWithArea] = await Promise.all([
    knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId({ userId, limitDate: campaignParticipation.sharedAt }),
    competenceRepository.listPixCompetencesOnly(),
  ]);

  const scorecards = _.map(competencesWithArea, (competence) => {
    const competenceId = competence.id;
    const knowledgeElements = knowledgeElementsGroupedByCompetenceId[competenceId];

    return Scorecard.buildFrom({
      userId,
      knowledgeElements,
      competence,
    });
  });

  return new SharedProfileForCampaign({
    id: campaignParticipation.id,
    sharedAt: campaignParticipation.sharedAt,
    campaignAllowsRetry,
    scorecards,
  });
};

