const {
  expect,
  HttpTestServer,
  sinon,
} = require('../../../test-helper');

const { NotFoundError } = require('../../../../lib/domain/errors');
const moduleUnderTest = require('../../../../lib/application/campaigns');

const campaignController = require('../../../../lib/application/campaigns/campaign-controller');
const campaignStatsController = require('../../../../lib/application/campaigns/campaign-stats-controller');

describe('Unit | Application | Router | campaign-router ', function() {

  let httpTestServer;

  beforeEach(async () => {
    sinon.stub(campaignController, 'save').callsFake((request, h) => h.response('ok').code(201));
    sinon.stub(campaignController, 'getByCode').callsFake((request, h) => h.response('ok').code(200));
    sinon.stub(campaignController, 'getById').callsFake((request, h) => h.response('ok').code(200));
    sinon.stub(campaignController, 'getCsvAssessmentResults').callsFake((request, h) => h.response('ok').code(200));
    sinon.stub(campaignController, 'getCsvProfilesCollectionResults').callsFake((request, h) => h.response('ok').code(200));
    sinon.stub(campaignController, 'update').callsFake((request, h) => h.response('ok').code(201));
    sinon.stub(campaignController, 'getCollectiveResult').callsFake((request, h) => h.response('ok').code(200));
    sinon.stub(campaignController, 'getAnalysis').callsFake((request, h) => h.response('ok').code(200));
    sinon.stub(campaignController, 'archiveCampaign').callsFake((request, h) => h.response('ok').code(200));
    sinon.stub(campaignController, 'unarchiveCampaign').callsFake((request, h) => h.response('ok').code(200));
    sinon.stub(campaignController, 'findProfilesCollectionParticipations').callsFake((request, h) => h.response('ok').code(200));
    sinon.stub(campaignController, 'findAssessmentParticipations').callsFake((request, h) => h.response('ok').code(200));
    sinon.stub(campaignController, 'division').callsFake((request, h) => h.response('ok').code(200));
    sinon.stub(campaignStatsController, 'getParticipationsByStage').callsFake((request, h) => h.response('ok').code(200));

    httpTestServer = new HttpTestServer();
    await httpTestServer.register(moduleUnderTest);
  });

  describe('POST /api/campaigns', () => {

    it('should return 201', async () => {
      // when
      const response = await httpTestServer.request('POST', '/api/campaigns');

      // then
      expect(response.statusCode).to.equal(201);
    });
  });

  describe('GET /api/campaigns?filter[code=SOMECODE]', () => {

    it('should return 200', async () => {
      // given
      campaignController.getByCode.returns('ok');

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns?filter[code=SOMECODE]');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 404 when controller throws a NotFound domain error', async () => {
      // given
      campaignController.getByCode.rejects(new NotFoundError());

      // when
      const response = await httpTestServer.request('GET', '/api/campaigns?filter[code=SOMECODE]');

      // then
      expect(response.statusCode).to.equal(404);
    });
  });

  describe('GET /api/campaigns/{id}', () => {

    it('should return 200', async () => {
      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/invalid');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('GET /api/campaigns/{id}/csv-assessment-results', () => {

    it('should return 200', async () => {
      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1/csv-assessment-results');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/invalid/csv-assessment-results');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('GET /api/campaigns/{id}/csv-profiles-collection-results', () => {

    it('should return 200', async () => {
      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1/csv-profiles-collection-results');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/invalid/csv-profiles-collection-results');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('PATCH /api/campaigns/{id}', () => {

    it('should return 201', async () => {
      // when
      const response = await httpTestServer.request('PATCH', '/api/campaigns/1');

      // then
      expect(response.statusCode).to.equal(201);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // when
      const response = await httpTestServer.request('PATCH', '/api/campaigns/invalid');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('GET /api/campaigns/{id}/collective-results', () => {

    it('should return 200', async () => {
      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1/collective-results');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/invalid/collective-results');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('GET /api/campaigns/{id}/analyses', () => {

    it('should return 200', async () => {
      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/1/analyses');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400', async () => {
      // when
      const response = await httpTestServer.request('GET', '/api/campaigns/wrong_id/analyses');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('PUT /api/campaigns/{id}/archive', () => {

    it('should return 200', async () => {
      // when
      const response = await httpTestServer.request('PUT', '/api/campaigns/1/archive');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // when
      const response = await httpTestServer.request('PUT', '/api/campaigns/invalid/archive');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('DELETE /api/campaigns/{id}/archive', () => {

    it('should return 200', async () => {
      // when
      const response = await httpTestServer.request('DELETE', '/api/campaigns/1/archive');

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // when
      const response = await httpTestServer.request('DELETE', '/api/campaigns/invalid/archive');

      // then
      expect(response.statusCode).to.equal(400);
    });
  });

  describe('GET /api/campaigns/{id}/profiles-collection-participations', () => {

    it('should return 200 with empty query string', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 200 with pagination', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations?page[number]=1&page[size]=25');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 200 with a string array of one element as division filter', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations?filter[divisions][]="3EMEB"');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 200 with a string array of several elements as division filter', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations?filter[divisions][]="3EMEB"&filter[divisions][]="3EMEA"');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 400 with unexpected filters', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations?filter[unexpected][]=5');

      // then
      expect(result.statusCode).to.equal(400);
    });

    it('should return 400 with a division filter which is not an array', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations?filter[divisions]="3EMEA"');

      // then
      expect(result.statusCode).to.equal(400);
    });

    it('should return 400 with a page number which is not a number', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations?page[number]=a');

      // then
      expect(result.statusCode).to.equal(400);
    });

    it('should return 400 with a page size which is not a number', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/profiles-collection-participations?page[size]=a');

      // then
      expect(result.statusCode).to.equal(400);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/invalid/profiles-collection-participations');

      // then
      expect(result.statusCode).to.equal(400);
    });
  });

  describe('GET /api/campaigns/{id}/assessment-participations', () => {

    it('should return 200 with empty query string', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 200 with pagination', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?page[number]=1&page[size]=25');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 200 with a string array of one element as division filter', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[divisions][]="3EMEB"');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 200 with a string array of several elements as division filter', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[divisions][]="3EMEB"&filter[divisions][]="3EMEA"');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 200 with a string array of one element as badge filter', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[badges][]=114');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 200 with a string array of several elements as badge filter', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[badges][]=114&filter[badges][]=115');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 200 with a string array of one element as stage filter', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[stages][]=114');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 200 with a string array of several elements as stage filter', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[stages][]=114&filter[stages][]=115');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 400 with unexpected filters', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[unexpected][]=5');

      // then
      expect(result.statusCode).to.equal(400);
    });

    it('should return 400 with a division filter which is not an array', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[divisions]="3EMEA"');

      // then
      expect(result.statusCode).to.equal(400);
    });

    it('should return 400 with a badge filter which is not an array', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[badges]=114');

      // then
      expect(result.statusCode).to.equal(400);
    });

    it('should return 400 with a badge filter which is not a number', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[badges][]="truc"');

      // then
      expect(result.statusCode).to.equal(400);
    });

    it('should return 400 with a stage filter which is not an array', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[stages]=114');

      // then
      expect(result.statusCode).to.equal(400);
    });

    it('should return 400 with a stage filter which is not a number', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?filter[stages][]="truc"');

      // then
      expect(result.statusCode).to.equal(400);
    });

    it('should return 400 with a page number which is not a number', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?page[number]=a');

      // then
      expect(result.statusCode).to.equal(400);
    });

    it('should return 400 with a page size which is not a number', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/assessment-participations?page[size]=a');

      // then
      expect(result.statusCode).to.equal(400);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/invalid/assessment-participations');

      // then
      expect(result.statusCode).to.equal(400);
    });
  });

  describe('GET /api/campaigns/{id}/divisions', () => {

    it('should return 200', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/divisions');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/invalid/divisions');

      // then
      expect(result.statusCode).to.equal(400);
    });
  });

  describe('GET /api/campaigns/{id}/stats/participations-by-stage', () => {

    it('should return 200', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/1/stats/participations-by-stage');

      // then
      expect(result.statusCode).to.equal(200);
    });

    it('should return 400 with an invalid campaign id', async () => {
      // when
      const result = await httpTestServer.request('GET', '/api/campaigns/invalid/stats/participations-by-stage');

      // then
      expect(result.statusCode).to.equal(400);
    });
  });
});
