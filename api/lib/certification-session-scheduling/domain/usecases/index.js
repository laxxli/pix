'use strict';

const { scheduleSession } = require('./schedule-session');
const sessionRepository = require('../../infrastructure/repositories/session-repository');
const certificationCenterMembershipRepository = require('../../infrastructure/repositories/certification-center-membership-repository');

module.exports = {
  scheduleSession: (params) => {
    console.log({ params });
    return scheduleSession({
      ...params,
      sessionRepository,
      certificationCenterMembershipRepository,
    });
  },
};
