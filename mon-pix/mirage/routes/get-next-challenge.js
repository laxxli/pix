import refQcmChallengeFull from '../data/challenges/ref-qcm-challenge';
import refQcuChallengeFull from '../data/challenges/ref-qcu-challenge';
import refQrocChallengeFull from '../data/challenges/ref-qroc-challenge';
import refQrocmChallengeFull from '../data/challenges/ref-qrocm-challenge';
import refTimedChallengeBis from '../data/challenges/ref-timed-challenge-bis';
import { challengeIds } from '../data/challenges/challenge-ids';

function getNextChallengeForDynamicAssessment(assessment, challenges) {
  const answers = assessment.answers.models;

  if (answers.length >= challenges.length) {
    return { data: null };
  }

  return challenges[answers.length];
}

function getNextChallengeForTestingAssessment(assessmentId, currentChallengeId) {
  // case 1 : we're trying to reach the first challenge for a given assessment
  if (!currentChallengeId) {
    return refQcmChallengeFull;
  }

  // case 2 : test already started, challenge exists.
  const nextChallenge = {

    // ref_course
    'ref_qcm_challenge_id': refQcuChallengeFull,
    'ref_qcu_challenge_id': refQrocChallengeFull,
    'ref_qroc_challenge_id': refQrocmChallengeFull,
    'ref_qrocm_challenge_id': 'null',

    'ref_timed_challenge_id': refTimedChallengeBis,
    'ref_timed_challenge_bis_id': 'null'
  };

  return nextChallenge[currentChallengeId];
}

export default function(schema, request) {
  const assessmentId = request.params.assessmentId;
  // dynamic assessment
  const assessment = schema.assessments.find(assessmentId);
  if (assessment) {
    const challenges = schema.challenges.find(challengeIds).models;
    return getNextChallengeForDynamicAssessment(assessment, challenges);
  }

  // testing assessment
  return getNextChallengeForTestingAssessment(assessmentId, null);
}