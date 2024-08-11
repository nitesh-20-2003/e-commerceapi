const User = require("../models/User");
const CreateUserToken = (user) => {
    return {name:user.name,user_id:user._id,role:user.role};

};
module.exports = CreateUserToken;
