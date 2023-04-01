import { User } from "../../auth/entities/user.entity";

export interface WSMessage<T = any> {
    type?: string;
    data?: T;
    user: User;
}
