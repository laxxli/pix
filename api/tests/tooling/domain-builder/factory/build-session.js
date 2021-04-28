// @ts-check
const Session = require('../../../../lib/domain/models/Session');

module.exports = function buildSession({
  id = 123,
  accessCode = 'ABCD123',
  address = '4 avenue du général perlimpimpim',
  certificationCenter = 'Centre de certif pix',
  certificationCenterId = 1234,
  date = '2021-01-01',
  description = 'Bonne année',
  examiner = 'Flute',
  room = '28D',
  time = '14:30',
  examinerGlobalComment = '',
  finalizedAt = null,
  resultsSentToPrescriberAt = null,
  publishedAt = null,
  assignedCertificationOfficerId = null,
  certificationCandidates = [],
} = {}) {
  return new Session({
    id,
    accessCode,
    address,
    certificationCenter,
    certificationCenterId,
    date,
    description,
    examiner,
    room,
    time,
    examinerGlobalComment,
    finalizedAt,
    resultsSentToPrescriberAt,
    publishedAt,
    assignedCertificationOfficerId,
    certificationCandidates,
  });
};
