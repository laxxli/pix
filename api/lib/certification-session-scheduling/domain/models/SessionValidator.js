const Joi = require('joi');

module.exports = {
  validate,
};

const schema = Joi.object({
  certificationCenterId: Joi.number().integer().positive().required(),
  certificationCenterName: Joi.any(),
  accessCode: Joi.any(),
  address: Joi.any(),
  examiner: Joi.any(),
  room: Joi.any(),
  date: Joi.any(),
  time: Joi.any(),
  description: Joi.any(),
});

function validate(session) {
  const { error } = schema.validate(session);

  if (error) {
    throw Error();
  }
}
