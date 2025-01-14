const _ = require('lodash');
const moment = require('moment');
const { sinon, expect, knex, databaseBuilder } = require('../../../test-helper');
const Campaign = require('../../../../lib/domain/models/Campaign');
const Assessment = require('../../../../lib/domain/models/Assessment');
const CampaignParticipation = require('../../../../lib/domain/models/CampaignParticipation');
const Skill = require('../../../../lib/domain/models/Skill');
const campaignParticipationRepository = require('../../../../lib/infrastructure/repositories/campaign-participation-repository');
const DomainTransaction = require('../../../../lib/infrastructure/DomainTransaction');

describe('Integration | Repository | Campaign Participation', () => {

  describe('#get', () => {

    let campaignId, recentAssessmentId;
    let campaignParticipationId, campaignParticipationNotSharedId;
    let campaignParticipationAssessments;
    beforeEach(async () => {
      campaignId = databaseBuilder.factory.buildCampaign({}).id;
      campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId, validatedSkillsCount: 12 }).id;
      campaignParticipationNotSharedId = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        isShared: false,
        sharedAt: null,
      }).id;

      const assessment1 = databaseBuilder.factory.buildAssessment({
        type: 'CAMPAIGN',
        campaignParticipationId,
        createdAt: new Date('2000-01-01T10:00:00Z'),
      });

      const assessment2 = databaseBuilder.factory.buildAssessment({
        type: 'CAMPAIGN',
        campaignParticipationId,
        createdAt: new Date('2000-03-01T10:00:00Z'),
      });

      databaseBuilder.factory.buildAssessment({
        type: 'CAMPAIGN',
        campaignParticipationId: campaignParticipationNotSharedId,
        createdAt: new Date('2000-02-01T10:00:00Z'),
      });

      campaignParticipationAssessments = [assessment1, assessment2];
      recentAssessmentId = assessment2.id;

      await databaseBuilder.commit();
    });

    it('should return a campaign participation object', async () => {
      // when
      const foundCampaignParticipation = await campaignParticipationRepository.get(campaignParticipationId);

      // then
      expect(foundCampaignParticipation.id).to.equal(campaignParticipationId);
      expect(foundCampaignParticipation.validatedSkillsCount).to.equal(12);
    });

    it('should return a null object for sharedAt when the campaign-participation is not shared', async () => {
      // when
      const foundCampaignParticipation = await campaignParticipationRepository.get(campaignParticipationNotSharedId);

      // then
      expect(foundCampaignParticipation.sharedAt).to.be.null;
    });

    it('should return the campaign participation with its last assessment', async () => {
      // when
      const foundCampaignParticipation = await campaignParticipationRepository.get(campaignParticipationId);

      // then
      expect(foundCampaignParticipation.assessmentId).to.be.equal(recentAssessmentId);
    });

    it('returns the assessments of campaignParticipation', async () => {
      //given
      const expectedAssessmentIds = campaignParticipationAssessments.map(({ id }) => id);

      // when
      const foundCampaignParticipation = await campaignParticipationRepository.get(campaignParticipationId);
      const assessmentIds = foundCampaignParticipation.assessments.map(({ id }) => id);

      // then
      expect(assessmentIds).to.exactlyContain(expectedAssessmentIds);
    });

  });

  describe('#save', () => {

    let campaignId, userId;
    beforeEach(async () => {
      await knex('campaign-participations').delete();
      userId = databaseBuilder.factory.buildUser({}).id;
      campaignId = databaseBuilder.factory.buildCampaign({}).id;

      await databaseBuilder.commit();
    });

    afterEach(() => {
      return knex('campaign-participations').delete();
    });

    it('should return the given campaign participation', async () => {
      // given
      const campaignParticipationToSave = new CampaignParticipation({
        campaignId,
        userId,
      });

      // when
      const savedCampaignParticipation = await campaignParticipationRepository.save(campaignParticipationToSave);

      // then
      expect(savedCampaignParticipation).to.be.instanceof(CampaignParticipation);
      expect(savedCampaignParticipation.id).to.exist;
      expect(savedCampaignParticipation.campaignId).to.equal(campaignParticipationToSave.campaignId);
      expect(savedCampaignParticipation.userId).to.equal(campaignParticipationToSave.userId);
    });

    it('should save the given campaign participation', async () => {
      // given
      const campaignParticipationToSave = new CampaignParticipation({
        campaignId,
        userId,
        participantExternalId: '034516273645RET',
      });

      // when
      const savedCampaignParticipation = await campaignParticipationRepository.save(campaignParticipationToSave);

      // then
      const campaignParticipationInDB = await knex.select('id', 'campaignId', 'participantExternalId', 'userId')
        .from('campaign-participations')
        .where({ id: savedCampaignParticipation.id });
      expect(campaignParticipationInDB).to.have.length(1);
      expect(campaignParticipationInDB[0].id).to.equal(savedCampaignParticipation.id);
      expect(campaignParticipationInDB[0].campaignId).to.equal(campaignParticipationToSave.campaignId);
      expect(campaignParticipationInDB[0].participantExternalId).to.equal(savedCampaignParticipation.participantExternalId);
      expect(campaignParticipationInDB[0].userId).to.equal(savedCampaignParticipation.userId);
    });

  });

  describe('update', () => {
    it('save the changes of the campaignParticipation', async () => {
      const campaignParticipationId = 12;
      const campaignParticipationToUpdate = databaseBuilder.factory.buildCampaignParticipation({ id: campaignParticipationId, isShared: false, sharedAt: null, validatedSkillsCount: null });

      await databaseBuilder.commit();

      campaignParticipationToUpdate.isShared = true;
      campaignParticipationToUpdate.sharedAt = new Date('2021-01-01');
      campaignParticipationToUpdate.validatedSkillsCount = 10;

      await campaignParticipationRepository.update(campaignParticipationToUpdate);
      const campaignParticipation = await knex('campaign-participations').where({ id: campaignParticipationId }).first();

      expect(campaignParticipation.isShared).to.equals(true);
      expect(campaignParticipation.sharedAt).to.deep.equals(new Date('2021-01-01'));
      expect(campaignParticipation.validatedSkillsCount).to.equals(10);
    });
  });

  describe('markPreviousParticipationsAsImproved', () => {
    it('marks previous participations as improved', async () => {
      const userId = databaseBuilder.factory.buildUser().id;
      const campaignId = databaseBuilder.factory.buildCampaign({ multipleSendings: true }).id;
      const oldCampaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ userId, campaignId, isShared: true, sharedAt: new Date('2020-01-01'), isImproved: false }).id;

      await databaseBuilder.commit();

      await DomainTransaction.execute((domainTransaction) => {
        return campaignParticipationRepository.markPreviousParticipationsAsImproved(campaignId, userId, domainTransaction);
      });

      const campaignParticipation = await knex('campaign-participations').where({ id: oldCampaignParticipationId }).first();

      expect(campaignParticipation.isImproved).to.equals(true);
    });

    it('does not change the campaign participations when an error occurred during the transaction', async () => {
      const userId = databaseBuilder.factory.buildUser().id;
      const campaignId = databaseBuilder.factory.buildCampaign({ multipleSendings: true }).id;
      const oldCampaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ userId, campaignId, isShared: true, sharedAt: new Date('2020-01-01'), isImproved: false }).id;

      await databaseBuilder.commit();
      try {
        await DomainTransaction.execute(async (domainTransaction) => {
          await campaignParticipationRepository.markPreviousParticipationsAsImproved(campaignId, userId, domainTransaction);
          throw new Error();
        });
        // eslint-disable-next-line no-empty
      } catch {}

      const campaignParticipation = await knex('campaign-participations').where({ id: oldCampaignParticipationId }).first();

      expect(campaignParticipation.isImproved).to.equals(false);
    });
  });

  describe('hasAlreadyParticipated', () => {
    it('returns true', async () => {
      const userId = databaseBuilder.factory.buildUser().id;
      const campaignId = databaseBuilder.factory.buildCampaign().id;
      databaseBuilder.factory.buildCampaignParticipation({ userId, campaignId });

      await databaseBuilder.commit();

      const result = await DomainTransaction.execute((domainTransaction) => {
        return campaignParticipationRepository.hasAlreadyParticipated(campaignId, userId, domainTransaction);
      });

      expect(result).to.equals(true);
    });

    it('returns false', async () => {
      const userId = databaseBuilder.factory.buildUser().id;
      const campaignId = databaseBuilder.factory.buildCampaign().id;

      await databaseBuilder.commit();
      const result = await DomainTransaction.execute((domainTransaction) => {
        return campaignParticipationRepository.hasAlreadyParticipated(campaignId, userId, domainTransaction);
      });

      expect(result).to.equals(false);
    });
  });

  describe('#count', () => {

    let campaignId;

    beforeEach(async () => {
      campaignId = databaseBuilder.factory.buildCampaign({}).id;

      _.times(2, () => {
        databaseBuilder.factory.buildCampaignParticipation({});
      });
      _.times(5, () => {
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          isShared: true,
        });
      });
      _.times(3, () => {
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId,
          isShared: false,
        });
      });

      await databaseBuilder.commit();
    });

    it('should count all campaignParticipations', async () => {
      // when
      const count = await campaignParticipationRepository.count();

      // then
      expect(count).to.equal(10);
    });

    it('should count all campaignParticipations by campaign', async () => {
      // when
      const count = await campaignParticipationRepository.count({ campaignId });

      // then
      expect(count).to.equal(8);
    });

    it('should count all shared campaignParticipations by campaign', async () => {
      // when
      const count = await campaignParticipationRepository.count({
        campaignId,
        isShared: true,
      });

      // then
      expect(count).to.equal(5);
    });
  });

  describe('#findProfilesCollectionResultDataByCampaignId', () => {

    let campaign1;
    let campaign2;
    let campaignParticipation1;
    let userId;

    beforeEach(async () => {
      userId = databaseBuilder.factory.buildUser({
        firstName: 'First',
        lastName: 'Last',
      }).id;
      campaign1 = databaseBuilder.factory.buildCampaign({ type: Campaign.types.PROFILES_COLLECTION });
      campaign2 = databaseBuilder.factory.buildCampaign({ type: Campaign.types.PROFILES_COLLECTION });

      campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign1.id,
        userId,
        isShared: true,
        createdAt: new Date('2017-03-15T14:59:35Z'),
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: campaign2.id,
        isShared: true,
      });
      await databaseBuilder.commit();
    });

    it('should return the campaign-participation linked to the given campaign', async () => {
      // given
      const campaignId = campaign1.id;

      // when
      const participationResultDatas = await campaignParticipationRepository.findProfilesCollectionResultDataByCampaignId(campaignId);

      // then
      const attributes = participationResultDatas.map((participationResultData) =>
        _.pick(participationResultData, ['id', 'isShared', 'sharedAt', 'participantExternalId', 'userId']));
      expect(attributes).to.deep.equal([
        {
          id: campaignParticipation1.id,
          isShared: true,
          sharedAt: campaignParticipation1.sharedAt,
          participantExternalId: campaignParticipation1.participantExternalId,
          userId: campaignParticipation1.userId,
        },
      ]);
    });

    context('when the participant is not linked to a schooling registration', () => {
      it('should return the campaign participation with firstName and lastName from the user', async () => {
        // given
        const campaignId = campaign1.id;

        // when
        const participationResultDatas = await campaignParticipationRepository.findProfilesCollectionResultDataByCampaignId(campaignId);

        // then
        const attributes = participationResultDatas.map((participationResultData) =>
          _.pick(participationResultData, ['participantFirstName', 'participantLastName']));
        expect(attributes).to.deep.equal([{
          participantFirstName: 'First',
          participantLastName: 'Last',
        }]);
      });
    });

    context('when the participant is linked to a schooling registration', () => {
      beforeEach(async () => {
        databaseBuilder.factory.buildSchoolingRegistration({ firstName: 'Hubert', lastName: 'Parterre', userId, organizationId: campaign1.organizationId, division: '6emeD' });
        await databaseBuilder.commit();
      });

      it('should return the campaign participation with firstName and lastName from the schooling registration', async () => {
        // given
        const campaignId = campaign1.id;

        // when
        const participationResultDatas = await campaignParticipationRepository.findProfilesCollectionResultDataByCampaignId(campaignId);

        // then
        const attributes = participationResultDatas.map((participationResultData) =>
          _.pick(participationResultData, ['participantFirstName', 'participantLastName', 'division']));
        expect(attributes).to.deep.equal([{
          participantFirstName: 'Hubert',
          participantLastName: 'Parterre',
          division: '6emeD',
        }]);
      });
    });

    context('when a participant has several schooling-registrations for different organizations', () => {
      let campaign;
      let otherCampaign;

      beforeEach(async () => {
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        const otherOrganizationId = databaseBuilder.factory.buildOrganization().id;
        const userId = databaseBuilder.factory.buildUser().id;
        campaign = databaseBuilder.factory.buildCampaign({ organizationId });
        otherCampaign = databaseBuilder.factory.buildCampaign({ organizationId });
        const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId,
        }).id;
        const otherCampaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: otherCampaign.id,
          userId,
        }).id;
        databaseBuilder.factory.buildAssessment({ campaignParticipationId, userId });
        databaseBuilder.factory.buildAssessment({ otherCampaignParticipationId, userId });
        databaseBuilder.factory.buildSchoolingRegistration({ organizationId, userId, division: '3eme' });
        databaseBuilder.factory.buildSchoolingRegistration({ userId, organizationId: otherOrganizationId, division: '2nd' });

        await databaseBuilder.commit();
      });

      it('should return the division of the school registration linked to the campaign', async () => {
        const campaignParticipationInfos = await campaignParticipationRepository.findProfilesCollectionResultDataByCampaignId(campaign.id);

        expect(campaignParticipationInfos.length).to.equal(1);
        expect(campaignParticipationInfos[0].division).to.equal('3eme');
      });
    });

    context('When sharedAt is null', () => {

      it('Should return null as shared date', async () => {
        // given
        const campaign = databaseBuilder.factory.buildCampaign({ sharedAt: null });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId,
          isShared: false,
          sharedAt: null,
        });

        await databaseBuilder.commit();

        // when
        const participationResultDatas = await campaignParticipationRepository.findProfilesCollectionResultDataByCampaignId(campaign.id);

        // then
        expect(participationResultDatas[0].sharedAt).to.equal(null);
      });
    });
  });

  describe('#findLatestOngoingByUserId', () => {

    let userId;

    beforeEach(async() => {
      userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();
    });

    it('should retrieve the most recent campaign participations where the campaign is not archived', async () => {
      const campaignId = databaseBuilder.factory.buildCampaign({ createdAt: new Date('2000-01-01T10:00:00Z'), archivedAt: null }).id;
      const moreRecentCampaignId = databaseBuilder.factory.buildCampaign({ createdAt: new Date('2000-02-01T10:00:00Z'), archivedAt: null }).id;
      const mostRecentButArchivedCampaignId = databaseBuilder.factory.buildCampaign({ createdAt: new Date('2001-03-01T10:00:00Z'), archivedAt: new Date('2000-09-01T10:00:00Z') }).id;

      databaseBuilder.factory.buildCampaignParticipation({ userId, createdAt: new Date('2000-04-01T10:00:00Z'), campaignId: moreRecentCampaignId });
      const expectedCampaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ userId, createdAt: new Date('2000-07-01T10:00:00Z'), campaignId }).id;
      databaseBuilder.factory.buildCampaignParticipation({ userId, createdAt: new Date('2001-08-01T10:00:00Z'), campaignId: mostRecentButArchivedCampaignId });

      databaseBuilder.factory.buildAssessment({ userId, campaignParticipationId: expectedCampaignParticipationId });
      databaseBuilder.factory.buildAssessment({ userId, campaignParticipationId: expectedCampaignParticipationId });

      await databaseBuilder.commit();

      const latestCampaignParticipations = await campaignParticipationRepository.findLatestOngoingByUserId(userId);
      const [latestCampaignParticipation1, latestCampaignParticipation2] = latestCampaignParticipations;

      expect(latestCampaignParticipation1.createdAt).to.deep.equal(new Date('2000-07-01T10:00:00Z'));
      expect(latestCampaignParticipation2.createdAt).to.deep.equal(new Date('2000-04-01T10:00:00Z'));
      expect(latestCampaignParticipation1.assessments).to.be.instanceOf(Array);
      expect(latestCampaignParticipation1.campaign).to.be.instanceOf(Campaign);
      expect(latestCampaignParticipations).to.have.lengthOf(2);
    });

  });

  describe('#findOneByCampaignIdAndUserId', () => {

    let userId;
    let campaignId;

    beforeEach(async () => {
      userId = databaseBuilder.factory.buildUser().id;
      const otherUserId = databaseBuilder.factory.buildUser().id;

      campaignId = databaseBuilder.factory.buildCampaign().id;
      const otherCampaignId = databaseBuilder.factory.buildCampaign().id;

      databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        userId: otherUserId,
      });
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId: otherCampaignId,
        userId,
      });
      await databaseBuilder.commit();
    });

    it('should return the campaign participation found', async () => {
      // given
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        userId,
      });
      await databaseBuilder.commit();

      // when
      const response = await campaignParticipationRepository.findOneByCampaignIdAndUserId({ campaignId, userId });

      // then
      expect(response).to.be.instanceOf(CampaignParticipation);
      expect(response.id).to.equal(campaignParticipation.id);
    });

    it('should return the non improved campaign participation found', async () => {
      // given
      databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        userId,
        isImproved: true,
      });
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        campaignId,
        userId,
      });

      await databaseBuilder.commit();

      // when
      const response = await campaignParticipationRepository.findOneByCampaignIdAndUserId({ campaignId, userId });

      // then
      expect(response).to.be.instanceOf(CampaignParticipation);
      expect(response.id).to.equal(campaignParticipation.id);
    });

    it('should return no campaign participation', async () => {
      // when
      const response = await campaignParticipationRepository.findOneByCampaignIdAndUserId({ campaignId, userId });

      // then
      expect(response).to.equal(null);
    });
  });

  describe('#findOneByAssessmentIdWithSkillIds', () => {

    const assessmentId = 12345;
    const campaignId = 123;
    const targetProfileId = 456;
    const skillId1 = 'rec1';
    const skillId2 = 'rec2';

    context('when assessment is linked', () => {

      beforeEach(async () => {

        databaseBuilder.factory.buildTargetProfile({ id: targetProfileId });
        databaseBuilder.factory.buildTargetProfileSkill({ skillId: skillId1, targetProfileId });
        databaseBuilder.factory.buildTargetProfileSkill({ skillId: skillId2, targetProfileId });
        databaseBuilder.factory.buildCampaign({ id: campaignId, targetProfileId });
        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({ campaignId });
        const otherCampaignParticipation = databaseBuilder.factory.buildCampaignParticipation({ });
        databaseBuilder.factory.buildAssessment({ id: assessmentId, campaignParticipationId: campaignParticipation.id, createdAt: moment().toDate() });
        databaseBuilder.factory.buildAssessment({ id: 67890, campaignParticipationId: otherCampaignParticipation.id, createdAt: moment().subtract(1, 'month').toDate() });

        await databaseBuilder.commit();
      });

      it('should return the campaign-participation linked to the given assessment with skills', async () => {
        // when
        const campaignParticipationFound = await campaignParticipationRepository.findOneByAssessmentIdWithSkillIds(assessmentId);

        // then
        expect(campaignParticipationFound.assessmentId).to.equal(assessmentId);
        expect(campaignParticipationFound.campaign.targetProfile.skills).to.have.lengthOf(2);
        expect(campaignParticipationFound.campaign.targetProfile.skills[0]).to.be.instanceOf(Skill);
        expect(campaignParticipationFound.campaign.targetProfile.skills[0].id).to.equal(skillId1);
        expect(campaignParticipationFound.campaign.targetProfile.skills[1]).to.be.instanceOf(Skill);
        expect(campaignParticipationFound.campaign.targetProfile.skills[1].id).to.equal(skillId2);
      });
    });

    context('when assessment is not linked', () => {

      beforeEach(async () => {
        databaseBuilder.factory.buildAssessment({ id: 67890 });
        databaseBuilder.factory.buildCampaignParticipation({ assessmentId: 67890 });

        await databaseBuilder.commit();
      });

      it('should return null', async () => {
        // when
        const campaignParticipationFound = await campaignParticipationRepository.findOneByAssessmentIdWithSkillIds(assessmentId);

        // then
        expect(campaignParticipationFound).to.equal(null);
      });
    });
  });

  describe('#findByAssessmentId', () => {

    let assessmentId, wantedCampaignParticipation;

    beforeEach(async () => {
      wantedCampaignParticipation = databaseBuilder.factory.buildCampaignParticipation({ });
      const otherCampaignParticipation = databaseBuilder.factory.buildCampaignParticipation();

      assessmentId = databaseBuilder.factory.buildAssessment({ campaignParticipationId: wantedCampaignParticipation.id }).id;
      databaseBuilder.factory.buildAssessment({ campaignParticipationId: wantedCampaignParticipation.id });
      databaseBuilder.factory.buildAssessment({ campaignParticipationId: otherCampaignParticipation.id });

      await databaseBuilder.commit();
    });

    it('should return campaign participation that match given assessmentId', async function() {
      // when
      const foundCampaignParticipation = await campaignParticipationRepository.findByAssessmentId(assessmentId);
      // then
      expect(foundCampaignParticipation).to.have.length(1);
      expect(foundCampaignParticipation[0].id).to.equal(wantedCampaignParticipation.id);
    });

  });

  describe('#updateWithSnapshot', () => {
    let clock;
    let campaignParticipation;
    const frozenTime = new Date('1987-09-01T00:00:00Z');

    beforeEach(async () => {
      campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
        isShared: false,
        sharedAt: null,
      });

      databaseBuilder.factory.buildKnowledgeElement({ userId: campaignParticipation.userId, createdAt: new Date('1985-09-01T00:00:00Z') });
      clock = sinon.useFakeTimers(frozenTime);

      await databaseBuilder.commit();
    });

    afterEach(() => {
      clock.restore();
      return knex('knowledge-element-snapshots').delete();
    });

    it('persists the campaign-participation changes', async () => {
      // given
      campaignParticipation.campaign = {};
      campaignParticipation.assessments = [];
      campaignParticipation.user = {};
      campaignParticipation.assessmentId = {};
      campaignParticipation.isShared = true;
      campaignParticipation.participantExternalId = 'Laura';

      // when
      await campaignParticipationRepository.updateWithSnapshot(campaignParticipation);

      const updatedCampaignParticipation = await knex('campaign-participations').where({ id: campaignParticipation.id }).first();
      // then
      expect(updatedCampaignParticipation.isShared).to.be.true;
      expect(updatedCampaignParticipation.participantExternalId).to.equals('Laura');
    });

    it('should save a snapshot', async () => {
      // given
      campaignParticipation.sharedAt = new Date();

      // when
      await campaignParticipationRepository.updateWithSnapshot(campaignParticipation);

      // then
      const snapshotInDB = await knex.select('id').from('knowledge-element-snapshots');
      expect(snapshotInDB).to.have.length(1);
    });
  });

  describe('#countSharedParticipationOfCampaign', () => {

    it('counts the number of campaign participation shared for a campaign', async () => {
      const campaignId = databaseBuilder.factory.buildCampaign({}).id;
      const otherCampaignId = databaseBuilder.factory.buildCampaign({}).id;

      databaseBuilder.factory.buildCampaignParticipation({ campaignId, isShared: true });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, isShared: false });
      databaseBuilder.factory.buildCampaignParticipation({ otherCampaignId, isShared: true });

      await databaseBuilder.commit();

      const numberOfCampaignShared = await campaignParticipationRepository.countSharedParticipationOfCampaign(campaignId);

      expect(numberOfCampaignShared).to.equal(1);
    });
  });

  describe('#isAssessmentCompleted', () => {

    it('should return true when latest assessment is completed', async () => {
      // given
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation().id;
      const otherCampaignParticipationId = databaseBuilder.factory.buildCampaignParticipation().id;
      // oldest assessment
      databaseBuilder.factory.buildAssessment({ campaignParticipationId, state: Assessment.states.STARTED, createdAt: new Date('2019-01-04') });
      // latest assessment
      databaseBuilder.factory.buildAssessment({ campaignParticipationId, state: Assessment.states.COMPLETED, createdAt: new Date('2019-02-05') });
      // noise
      databaseBuilder.factory.buildAssessment({ campaignParticipationId: otherCampaignParticipationId, state: Assessment.states.STARTED, createdAt: new Date('2019-04-05') });
      await databaseBuilder.commit();

      // when
      const isAssessmentCompleted = await campaignParticipationRepository.isAssessmentCompleted(campaignParticipationId);

      // then
      expect(isAssessmentCompleted).to.be.true;
    });

    it('should return false when latest assessment is not completed', async () => {
      // given
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation().id;
      // oldest assessment
      databaseBuilder.factory.buildAssessment({ campaignParticipationId, state: Assessment.states.COMPLETED, createdAt: new Date('2019-01-04') });
      // latest assessment
      databaseBuilder.factory.buildAssessment({ campaignParticipationId, state: Assessment.states.STARTED, createdAt: new Date('2019-02-05') });
      await databaseBuilder.commit();

      // when
      const isAssessmentCompleted = await campaignParticipationRepository.isAssessmentCompleted(campaignParticipationId);

      // then
      expect(isAssessmentCompleted).to.be.false;
    });

    it('should return false when campaignParticipation has no assessment', async () => {
      // given
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation().id;
      await databaseBuilder.commit();

      // when
      const isAssessmentCompleted = await campaignParticipationRepository.isAssessmentCompleted(campaignParticipationId);

      // then
      expect(isAssessmentCompleted).to.be.false;
    });
  });

  describe('#isRetrying', () => {
    let campaignId;
    let campaignParticipationId;
    let userId;

    beforeEach(async () => {
      userId = databaseBuilder.factory.buildUser().id;
      campaignId = databaseBuilder.factory.buildCampaign().id;
      await databaseBuilder.commit();
    });

    context('When the user has just one participation shared', () => {
      beforeEach(async () => {
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId, isImproved: false, sharedAt: new Date('2002-10-10') }).id;
        await databaseBuilder.commit();
      });

      it('returns false', async () => {
        const result = await campaignParticipationRepository.isRetrying({ userId, campaignParticipationId });
        expect(result).to.be.false;
      });
    });

    context('When the user has just one participation not shared', () => {
      beforeEach(async () => {
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId, isImproved: false, sharedAt: null }).id;
        await databaseBuilder.commit();
      });

      it('returns false', async () => {
        const result = await campaignParticipationRepository.isRetrying({ userId, campaignParticipationId });
        expect(result).to.be.false;
      });
    });

    context('When the user has several participations but all shared', () => {
      beforeEach(async () => {
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId, isImproved: true, sharedAt: new Date('2002-10-10') });
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId, isImproved: false, sharedAt: new Date('2002-10-10') }).id;
        await databaseBuilder.commit();
      });

      it('returns false', async () => {
        const result = await campaignParticipationRepository.isRetrying({ userId, campaignParticipationId });
        expect(result).to.be.false;
      });
    });

    context('When the user has several participations but not in the same campaign', () => {
      beforeEach(async () => {
        const otherCampaignId = databaseBuilder.factory.buildCampaign().id;
        databaseBuilder.factory.buildCampaignParticipation({ campaignId: otherCampaignId, userId, isImproved: true, sharedAt: new Date('2002-10-10') });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId: otherCampaignId, userId, isImproved: false, sharedAt: null });
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId, isImproved: false, sharedAt: null }).id;
        await databaseBuilder.commit();
      });

      it('returns false', async () => {
        const result = await campaignParticipationRepository.isRetrying({ userId, campaignParticipationId });
        expect(result).to.be.false;
      });
    });

    context('When there is several participations but not for the same user', () => {
      beforeEach(async () => {
        const otherUserId = databaseBuilder.factory.buildUser().id;
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId: otherUserId, isImproved: true, sharedAt: new Date('2002-10-10') });
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId: otherUserId, isImproved: false, sharedAt: null });
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId, isImproved: false, sharedAt: null }).id;
        await databaseBuilder.commit();
      });

      it('returns false', async () => {
        const result = await campaignParticipationRepository.isRetrying({ userId, campaignParticipationId });
        expect(result).to.be.false;
      });
    });

    context('When the user is retrying the campaign', () => {
      beforeEach(async () => {
        databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId, isImproved: true, sharedAt: new Date('2002-10-10') });
        campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ campaignId, userId, isImproved: false, sharedAt: null }).id;
        await databaseBuilder.commit();
      });

      it('returns true', async () => {
        const result = await campaignParticipationRepository.isRetrying({ userId, campaignParticipationId });
        expect(result).to.be.true;
      });
    });
  });

  describe('#countParticipationsByStage', () => {
    let campaignId;

    const stagesBoundaries = [
      { id: 1, from: 0, to: 4 },
      { id: 2, from: 5, to: 9 },
      { id: 3, from: 10, to: 19 },
    ];

    beforeEach(async () => {
      campaignId = databaseBuilder.factory.buildCampaign().id;
      await databaseBuilder.commit();
    });

    it('returns an empty object when no participations', async () => {
      await databaseBuilder.commit();

      const result = await campaignParticipationRepository.countParticipationsByStage(campaignId, stagesBoundaries);

      expect(result).to.deep.equal({});
    });

    it('returns the distribution for the campaign', async () => {
      databaseBuilder.factory.buildCampaignParticipation({ validatedSkillsCount: 0 });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, validatedSkillsCount: 0 });
      await databaseBuilder.commit();

      const result = await campaignParticipationRepository.countParticipationsByStage(campaignId, stagesBoundaries);

      expect(result).to.deep.equal({ '1': 1, '2': 0, '3': 0 });
    });

    it('returns the distribution for only isImproved=false participations', async () => {
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, validatedSkillsCount: 0, isImproved: false });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, validatedSkillsCount: 0, isImproved: true });
      await databaseBuilder.commit();

      const result = await campaignParticipationRepository.countParticipationsByStage(campaignId, stagesBoundaries);

      expect(result).to.deep.equal({ '1': 1, '2': 0, '3': 0 });
    });

    it('returns the distribution of participations by stage', async () => {
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, validatedSkillsCount: 0 });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, validatedSkillsCount: 5 });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, validatedSkillsCount: 6 });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, validatedSkillsCount: 10 });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, validatedSkillsCount: 12 });
      databaseBuilder.factory.buildCampaignParticipation({ campaignId, validatedSkillsCount: 19 });
      await databaseBuilder.commit();

      const result = await campaignParticipationRepository.countParticipationsByStage(campaignId, stagesBoundaries);

      expect(result).to.deep.equal({ '1': 1, '2': 2, '3': 3 });
    });
  });
});
