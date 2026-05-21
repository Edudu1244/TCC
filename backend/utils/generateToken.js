const jwt = require("jsonwebtoken");

const generateToken = (user) => {

    return jwt.sign(

        {
            id: user.id,
            email: user.email
        },

        "segredo_super_secreto",

        {
            expiresIn: "7d"
        }

    );

};

module.exports = generateToken;
