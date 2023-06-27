//handle errors from signup
const handleErrors = (err) => {
    let errors = {};
    //console.log(err);

    if (err.code === 11000) {
        errors.email = "Email already in use";
        return errors;
    };

    if (err.message.includes("User validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
        return errors;
    }

    if (err.message.includes("urlSchema validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
        return errors;
    }
};

module.exports = { handleErrors };