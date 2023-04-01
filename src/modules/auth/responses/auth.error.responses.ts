const AuthErrors = {
    AUTH_400_EMPTY_UNAME: {
        status: 400,
        code: "AUTH_400_EMPTY_UNAME",
        message: "Username cannot be empty!",
    },
    AUTH_400_EMPTY_PASSWORD: {
        status: 400,
        code: "AUTH_400_EMPTY_PASSWORD",
        message: "Password cannot be empty!",
    },
    AUTH_401_CORS: {
        status: 401,
        code: "AUTH_401_CORS",
        message: "Access blocked by CORS!",
    },
    AUTH_401_INVALID: {
        status: 401,
        code: "AUTH_401_INVALID",
        message: "Invalid username or password!",
    },
    AUTH_401_INVALID_PASSWORD: {
        status: 401,
        code: "AUTH_401_INVALID_PASSWORD",
        message: "Invalid password!",
    },
    AUTH_401_NOT_LOGGED_IN: {
        status: 401,
        code: "AUTH_401_NOT_LOGGED_IN",
        message: "User must be logged in to access this resource!",
    },
    AUTH_401_NOT_ACTIVE: {
        status: 401,
        code: "AUTH_401_NOT_ACTIVE",
        message: "User account is inactive. Contact a Moderator or Admin!",
    },
    AUTH_401_TOKEN_NOT_SET: {
        status: 401,
        code: "AUTH_401_TOKEN_NOT_SET",
        message: "Cannot find a token!",
    },
    AUTH_401_REFRESH_TOKEN_NOT_SET: {
        status: 401,
        code: "AUTH_401_REFRESH_TOKEN_NOT_SET",
        message: "Cannot find a refresh token!",
    },
    AUTH_401_INVALID_TOKEN: {
        status: 401,
        code: "AUTH_401_INVALID_TOKEN",
        message: "Invalid or expired token received!",
    },
    AUTH_401_INVALID_REFRESH_TOKEN: {
        status: 401,
        code: "AUTH_401_INVALID_REFRESH_TOKEN",
        message: "Invalid or expired refresh token received!",
    },
    AUTH_403_PENDING: {
        status: 401,
        code: "AUTH_403_PENDING",
        message: "Your application is still processing. you will be getting a confirmation soon via e-mail.!",
    },
    AUTH_403_ROLE_FORBIDDEN: {
        status: 403,
        code: "AUTH_403_ROLE_FORBIDDEN",
        message: "User doesn't have privileges to access this resource!",
    },
    AUTH_500_REGISTER: {
        status: 500,
        code: "AUTH_500_REGISTER",
        message: "Error occurred while applying!",
    },
    AUTH_500_LOGIN: {
        status: 500,
        code: "AUTH_500_LOGIN",
        message: "Error occurred while logging in!",
    },
    AUTH_500: {
        status: 500,
        code: "AUTH_500",
        message: "Error occurred!",
    },
    USER_400_EMPTY_FNAME: {
        status: 400,
        code: "USER_400_EMPTY_FNAME",
        message: "User first name cannot be empty!",
    },
    USER_400_EMPTY_LNAME: {
        status: 400,
        code: "USER_400_EMPTY_LNAME",
        message: "User last name cannot be empty!",
    },
    USER_400_EMPTY_UNAME: {
        status: 400,
        code: "USER_400_EMPTY_UNAME",
        message: "User username cannot be empty!",
    },
    USER_400_EMPTY_PASSWORD: {
        status: 400,
        code: "USER_400_EMPTY_PASSWORD",
        message: "User password cannot be empty!",
    },
    USER_400_NOT_EMPTY_UNAME: {
        status: 400,
        code: "USER_400_NOT_EMPTY_UNAME",
        message: "User username cannot be updated!",
    },
    USER_400_NOT_EMPTY_PASSWORD: {
        status: 400,
        code: "USER_400_NOT_EMPTY_PASSWORD",
        message: "User password cannot be updated!",
    },
    USER_400_NOT_EMPTY_SALT: {
        status: 400,
        code: "USER_400_NOT_EMPTY_SALT",
        message: "User salt cannot be inserted/updated!",
    },
    USER_404: {
        status: 404,
        code: "USER_404",
        message: "Cannot find a user with given id!",
    },
    USER_409_EXIST_UNAME: {
        status: 409,
        code: "USER_409_EXIST_UNAME",
        message: "User with given username already exist!",
    },
    USER_500_CREATE: {
        status: 500,
        code: "USER_500_CREATE",
        message: "Error occurred while creating user!",
    },
};

export { AuthErrors };
