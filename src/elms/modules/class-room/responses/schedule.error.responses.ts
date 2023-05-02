const ScheduleErrors = {
    SCHEDULE_400_EMPTY_DAY: {
        status: 400,
        code: "SCHEDULE_400_EMPTY_DAY",
        message: "Schedule day cannot be empty!",
    },
    SCHEDULE_400_EMPTY_START_TIME: {
        status: 400,
        code: "SCHEDULE_400_EMPTY_START_TIME",
        message: "Schedule start time cannot be empty!",
    },
    SCHEDULE_400_EMPTY_END_TIME: {
        status: 400,
        code: "SCHEDULE_400_EMPTY_END_TIME",
        message: "Schedule end time cannot be empty!",
    },
    SCHEDULE_400_EMPTY_CLASS_ROOM_ID: {
        status: 400,
        code: "SCHEDULE_400_EMPTY_CLASS_ROOM_ID",
        message: "Schedule class room id cannot be empty!",
    },
    SCHEDULE_400_INVALID_DAY: {
        status: 400,
        code: "SCHEDULE_400_INVALID_DAY",
        message: "Invalid value for schedule day!",
    },
    SCHEDULE_400_INVALID_START_TIME: {
        status: 400,
        code: "SCHEDULE_400_INVALID_START_TIME",
        message: "Invalid value for schedule start time!",
    },
    SCHEDULE_400_INVALID_END_TIME: {
        status: 400,
        code: "SCHEDULE_400_INVALID_END_TIME",
        message: "Invalid value for schedule end time!",
    },
    SCHEDULE_400_INVALID_CLASS_ROOM_ID: {
        status: 400,
        code: "SCHEDULE_400_INVALID_CLASS_ROOM_ID",
        message: "Invalid value for schedule class room id!",
    },
};

export { ScheduleErrors };
