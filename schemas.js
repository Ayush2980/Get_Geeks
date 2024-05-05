const Joi = require("joi");
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);

module.exports.userJOI = Joi.object({
  // user : Joi.object({
    username: Joi.string().required(),
    // fullname: Joi.string().required(),
    Email : Joi.string().required(),
    // state: Joi.string().required(),
    country: Joi.string().required(),
    CCprof: Joi.string().required(),
    CFprof: Joi.string().required(),
    images : Joi.object({
      url : Joi.string(),
      filename : Joi.string(),
    }),
    password: joiPassword
                .string()
                .minOfSpecialCharacters(1)
                .minOfLowercase(1)
                .minOfUppercase(1)
                .minOfNumeric(1)
                .noWhiteSpaces()
                .onlyLatinCharacters()
                .required(),
});
