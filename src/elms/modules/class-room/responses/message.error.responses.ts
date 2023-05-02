const MessageErrors = {
    MESSAGE_400_EMPTY_MESSAGE: {
        status: 400,
        code: "MESSAGE_400_EMPTY_MESSAGE",
        message: "Message cannot be empty!",
    },
    MESSAGE_400_EMPTY_TYPE: {
        status: 400,
        code: "MESSAGE_400_EMPTY_TYPE",
        message: "Message type cannot be empty!",
    },
    MESSAGE_400_EMPTY_CHATROOM_ID: {
        status: 400,
        code: "MESSAGE_400_EMPTY_CHATROOM_ID",
        message: "Chatroom id cannot be empty!",
    },
    MESSAGE_400_INVALID_TYPE: {
        status: 400,
        code: "MESSAGE_400_INVALID_TYPE",
        message: "Invalid message type!",
    },
};

export { MessageErrors };
