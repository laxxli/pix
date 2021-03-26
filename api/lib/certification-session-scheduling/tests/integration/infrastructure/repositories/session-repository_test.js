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

  describe('#save', () => {

    afterEach(() => {
      return knex('sessions').delete();
    });

    it('creates a new session when does not exist', async () => {
      // given
      const certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;

      const sessionDTO = {
        certificationCenterId,
        certificationCenter: 'Centre des Anne-Etoiles',
        address: '18 rue Jean Dussourd',
        room: '204',
        accessCode: 'AZER12',
        examiner: 'Julie Dupont',
        date: '2021-03-26',
        time: '12:00:00',
        description: 'Ma session',
      };
      const session = Session.schedule(sessionDTO);

      await databaseBuilder.commit();

      // when
      await sessionRepository.save(session);

      // then
      const foundSessions = await knex
        .select(
          'certificationCenterId',
          'certificationCenter',
          'address',
          'room',
          'accessCode',
          'examiner',
          'date',
          'time',
          'description',
        )
        .from('sessions');

      expect(foundSessions).to.deep.equal([sessionDTO]);
    });
  });
});
