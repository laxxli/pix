const _ = require('lodash');
const Badge = require('../models/Badge');
const PartnerCertificationScoring = require('./PartnerCertificationScoring');
const { NotEligibleCandidateError } = require('../errors');
const Joi = require('joi')
  .extend(require('@joi/date'));
const { validateEntity } = require('../validators/entity-validator');

const MIN_PERCENTAGE = 75;

const { MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED, MINIMUM_REPRODUCIBILITY_RATE_TO_BE_TRUSTED } = require('../constants');

function _isOverPercentage(value = 0, total, percentage = MIN_PERCENTAGE) {
  return value >= (total * percentage / 100);
}

function _hasRequiredPixValue({ maxReachablePixByCompetenceForClea, cleaCompetenceMarks }) {
  const certifiableCompetenceIds = _.map(cleaCompetenceMarks, 'competenceId');
  return !_.isEmpty(certifiableCompetenceIds)
    && _.every(certifiableCompetenceIds, (competenceId) => _isOverPercentage(
      _.find(cleaCompetenceMarks, { competenceId }).score,
      maxReachablePixByCompetenceForClea[competenceId],
    ));
}

function _hasSufficientReproducibilityRateToBeTrusted(reproducibilityRate) {
  return reproducibilityRate >= MINIMUM_REPRODUCIBILITY_RATE_TO_BE_TRUSTED;
}

function _hasNotMinimumReproducibilityRateToBeCertified(reproducibilityRate) {
  return reproducibilityRate <= MINIMUM_REPRODUCIBILITY_RATE_TO_BE_CERTIFIED;
}

class CleaCertificationScoring extends PartnerCertificationScoring {

  constructor({
    certificationCourseId,
    hasAcquiredBadge,
    reproducibilityRate,
    cleaCompetenceMarks,
    isBadgeAcquisitionStillValid = true,
    maxReachablePixByCompetenceForClea,
  } = {}) {
    super({
      certificationCourseId,
      partnerKey: Badge.keys.PIX_EMPLOI_CLEA,
    });

    this.hasAcquiredBadge = hasAcquiredBadge;
    this.isBadgeAcquisitionStillValid = isBadgeAcquisitionStillValid;
    this.reproducibilityRate = reproducibilityRate;
    this.cleaCompetenceMarks = cleaCompetenceMarks;
    this.maxReachablePixByCompetenceForClea = maxReachablePixByCompetenceForClea;

    const schema = Joi.object({
      hasAcquiredBadge: Joi.boolean().required(),
      reproducibilityRate: Joi.number().required(),
      cleaCompetenceMarks: Joi.array().required(),
      maxReachablePixByCompetenceForClea: Joi.object().required(),
    }).unknown();

    validateEntity(schema, this);
  }

  isEligible() {
    return this.hasAcquiredBadge && this.isBadgeAcquisitionStillValid;
  }

  setBadgeAcquisitionStillValid(isValid) {
    this.isBadgeAcquisitionStillValid = isValid;
  }

  isAcquired() {
    if (!this.hasAcquiredBadge) throw new NotEligibleCandidateError();

    if (_hasNotMinimumReproducibilityRateToBeCertified(this.reproducibilityRate)) return false;

    if (_hasSufficientReproducibilityRateToBeTrusted(this.reproducibilityRate)) return true;

    return _hasRequiredPixValue({
      cleaCompetenceMarks: this.cleaCompetenceMarks,
      maxReachablePixByCompetenceForClea: this.maxReachablePixByCompetenceForClea,
    });
  }
}

module.exports = CleaCertificationScoring;
