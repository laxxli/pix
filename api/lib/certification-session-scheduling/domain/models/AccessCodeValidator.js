const Joi = require('joi');

module.exports = {
  validate,
};

const schema = Joi.object({
  value: Joi.string().regex(/[A-Z]{4}[0-9]{2}/).required(),
});

function validate(accessCode) {
  const { error } = schema.validate(accessCode);

  if (error) {
    throw new Error(error);
  }
}
