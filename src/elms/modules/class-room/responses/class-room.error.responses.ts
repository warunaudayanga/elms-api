const ClassRoomErrors = {
    CLASS_ROOM_400_EMPTY_NAME: {
        status: 400,
        code: "CLASS_ROOM_400_EMPTY_NAME",
        message: "Classroom name cannot be empty!",
    },
    CLASS_ROOM_400_EMPTY_PAYMENT: {
        status: 400,
        code: "CLASS_ROOM_400_EMPTY_PAYMENT",
        message: "Classroom payment cannot be empty!",
    },
    CLASS_ROOM_400_EMPTY_GRADE_ID: {
        status: 400,
        code: "CLASS_ROOM_400_EMPTY_GRADE_ID",
        message: "Classroom grade ID cannot be empty!",
    },
    CLASS_ROOM_400_EMPTY_SUBJECT_ID: {
        status: 400,
        code: "CLASS_ROOM_400_EMPTY_SUBJECT_ID",
        message: "Classroom subject ID cannot be empty!",
    },
    CLASS_ROOM_400_EMPTY_TUTOR_ID: {
        status: 400,
        code: "CLASS_ROOM_400_EMPTY_TUTOR_ID",
        message: "Classroom tutor ID cannot be empty!",
    },
    CLASS_ROOM_400_EMPTY_STUDENT_ID: {
        status: 400,
        code: "CLASS_ROOM_400_EMPTY_STUDENT_ID",
        message: "Classroom student ID cannot be empty!",
    },
    CLASS_ROOM_400_EMPTY_CLASS_ROOM_ID: {
        status: 400,
        code: "CLASS_ROOM_400_EMPTY_CLASS_ROOM_ID",
        message: "Classroom ID cannot be empty!",
    },
    CLASSROOM_ALREADY_ENROLLED: {
        status: 400,
        code: "CLASSROOM_ALREADY_ENROLLED",
        message: "You are already enrolled in this classroom!",
    },
};

export { ClassRoomErrors };
