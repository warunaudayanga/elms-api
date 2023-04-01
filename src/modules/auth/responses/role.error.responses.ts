const RoleErrors = {
    ROLE_400_EMPTY_ID: {
        status: 400,
        code: "ROLE_400_EMPTY_ID",
        message: "Role id cannot be empty!",
    },
    ROLE_400_EMPTY_IDS: {
        status: 400,
        code: "ROLE_400_EMPTY_IDS",
        message: "Role ids cannot be empty!",
    },
    ROLE_400_EMPTY_NAME: {
        status: 400,
        code: "ROLE_400_EMPTY_NAME",
        message: "Role name cannot be empty!",
    },
    ROLE_400_EMPTY_PRIORITY: {
        status: 400,
        code: "ROLE_400_EMPTY_PRIORITY",
        message: "Role priority cannot be empty!",
    },
    ROLE_400_EMPTY_STATUS: {
        status: 400,
        code: "ROLE_400_EMPTY_STATUS",
        message: "Role status cannot be empty!",
    },
    ROLE_400_EMPTY_PERMISSIONS: {
        status: 400,
        code: "ROLE_400_EMPTY_PERMISSIONS",
        message: "Role permissions cannot be empty!",
    },
    ROLE_400_INVALID_IDS: {
        status: 400,
        code: "ROLE_400_INVALID_IDS",
        message: "Invalid value for role ids!",
    },
    ROLE_400_INVALID_STATUS: {
        status: 400,
        code: "ROLE_400_INVALID_STATUS",
        message: "Invalid value for role status!",
    },
    ROLE_400_INVALID_PERMISSIONS: {
        status: 400,
        code: "ROLE_400_INVALID_PERMISSIONS",
        message: "Invalid value for role permissions!",
    },
    ROLE_409_EXIST_NAME: {
        status: 409,
        code: "ROLE_409_EXIST_NAME",
        message: "Role with given name exist!",
    },
};

export { RoleErrors };
