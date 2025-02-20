const {validate, Joi} = require("express-validation");

const assignPermissionToRoleValidation = validate({
    body: Joi.object({
        roleId: Joi.number().required(),
        permissions: Joi.array().items(
            Joi.number()
        ).optional(),
    })
});

module.exports = {
    assignPermissionToRoleValidation
};
