import Model, { attr } from '@ember-data/model';

export default class CampaignParticipationOverviews extends Model {

  // attributes
  @attr('date') createdAt;
  @attr('boolean') isShared;
  @attr('date') sharedAt;
  @attr('string') organizationName;
  @attr('string') assessmentState;
  @attr('string') campaignCode;
  @attr('string') campaignTitle;
}