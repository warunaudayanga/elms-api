export enum FKConstraint {
    USER_AREA = "FK_user_area",
    USER_TUTOR = "FK_user_tutor",
    CLASS_ROOM_GRADE = "FK_classRoom_grade",
    CLASS_ROOM_SUBJECT = "FK_classRoom_subject",
    CLASS_ROOM_TUTOR = "FK_classRoom_tutor",
    CLASS_ROOM_SCHEDULE = "FK_classRoom_schedule",
    CLASS_ROOM_ASSESSMENT = "FK_classRoom_assessment",
    CLASS_STUDENTS_CLASS_ROOM = "FK_classStudents_classRoom",
    CLASS_STUDENTS_STUDENT = "FK_classStudents_student",
    PAYMENT_CLASS_STUDENTS = "FK_payment_classStudents",
    SCHEDULE_HISTORY_SCHEDULE = "FK_scheduleHistory_schedule",
    ASSESSMENT_SUBMISSION_ASSESSMENT = "FK_assessmentSubmission_assessment",
    ASSESSMENT_SUBMISSION_USER = "FK_assessmentSubmission_user",
    VERIFICATION_USER = "FK_verification_user",
    NOTIFICATION_USER = "FK_notification_user",
}

export enum UNIQUEConstraint {
    USER_USERNAME = "UNIQUE_user_username",
    USER_EMAIL = "UNIQUE_user_email",
    AREA_NAME = "UNIQUE_area_name",
    CLASS_STUDENT_CLASS_ROOM_STUDENT = "UNIQUE_classStudent_classRoom_student",
    GRADE_NAME = "UNIQUE_grade_name",
    SUBJECT_NAME = "UNIQUE_subject_name",
    MESSAGES_USER_STATUS_MESSAGE_READER = "UNIQUE_messagesUserStatus_message_reader",
}
