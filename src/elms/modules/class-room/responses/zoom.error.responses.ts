const ZoomErrors = {
    ZOOM_400_EMPTY_MEETING_NUMBER: {
        status: 400,
        code: "ZOOM_400_EMPTY_MEETING_NUMBER",
        message: "Meeting number cannot be empty!",
    },
    ZOOM_400_EMPTY_CLASS_ID: {
        status: 400,
        code: "ZOOM_400_EMPTY_CLASS_ID",
        message: "Class ID cannot be empty!",
    },
    ZOOM_400_EMPTY_ROLE: {
        status: 400,
        code: "ZOOM_400_EMPTY_ROLE",
        message: "Role cannot be empty!",
    },
    ZOOM_400_INVALID_ROLE: {
        status: 400,
        code: "ZOOM_400_INVALID_ROLE",
        message: "Invalid value for role!",
    },
    ZOOM_401_UNAUTHORIZED: {
        status: 403,
        code: "ZOOM_401_UNAUTHORIZED",
        message: "Unauthorized!",
    },
};

export { ZoomErrors };
