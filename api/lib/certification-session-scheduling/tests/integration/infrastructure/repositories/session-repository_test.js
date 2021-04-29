const {
  expect,
  knex,
  databaseBuilder,
} = require('../../../../../../tests/test-helper');

const sessionRepository = require('../../../../infrastructure/repositories/session-repository');
const { Session } = require('../../../../domain/models/Session');

describe('Integration | Repositories | session', () => {

  afterEach(()=> {
    return databaseBuilder.clean();
  });

  describe('#get', () => {
    afterEach(() => {
      return knex('sessions').delete();
    });

    it('returns a session', async () => {
      // given
      const sessionId = databaseBuilder.factory.buildSession({
        room: 'Salle 101',
      }).id;
      await databaseBuilder.commit();

      // when
      const result = await sessionRepository.get(sessionId);

      // then
      expect(result.room).to.deep.equal('Salle 101');
    });
  });

  describe('#save', () => {

    afterEach(() => {
      return knex('sessions').delete();
    });

    it('creates a new session when does not exist', async () => {
      // given
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;

      const sessionDTO = {
        certificationCenterId,
        certificationCenterName: 'Centre des Anne-Etoiles',
        address: '18 rue Jean Dussourd',
        room: '204',
        accessCode: 'AZER12',
        examiner: 'Julie Dupont',
        date: '2021-03-26',
        time: '12:00',
        description: 'Ma session',
      };
      const session = new Session(sessionDTO);

      await databaseBuilder.commit();

      // when
      await sessionRepository.save(session);

      // then
      const foundSession = await knex
        .select(
          'certificationCenterId',
          'address',
          'room',
          'accessCode',
          'examiner',
          'date',
          'time',
          'description',
        )
        .select({
          'certificationCenterName': 'certificationCenter',
        })
        .from('sessions')
        .first();
      foundSession.time = foundSession.time.substr(0, 5);

      expect(foundSession).to.deep.equal(sessionDTO);
    });

    it('returns the id of the saved session', async() => {
      // given
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;

      const sessionDTO = {
        certificationCenterId,
        certificationCenterName: 'Centre des Anne-Etoiles',
        address: '18 rue Jean Dussourd',
        room: '204',
        accessCode: 'AZER12',
        examiner: 'Julie Dupont',
        date: '2021-03-26',
        time: '12:00',
        description: 'Ma session',
      };
      const session = new Session(sessionDTO);

      await databaseBuilder.commit();

      // when
      const savedSessionId = await sessionRepository.save(session);

      // then
      const savedSession = await knex
        .from('sessions')
        .where({ id: savedSessionId })
        .first();
      expect(savedSession).to.exist;
    });
  });
});
