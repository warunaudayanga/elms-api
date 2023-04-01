export interface PushoverPayload {
    title: string;
    message: string;
}

export interface PushoverRequestDto extends PushoverPayload {
    token: string;
    user: string;
    html: 1 | 0;
}
