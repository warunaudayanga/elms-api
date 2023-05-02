// import { Injectable } from "@nestjs/common";
// import { EntityService } from "../../../../core/entity";
// import { InjectRepository } from "@nestjs/typeorm";
// import { SocketService } from "../../../../modules/socket/services";
// import { Profile } from "../entities/profile.entity";
// import { ProfileRepository } from "../repositories/profile.repository";
// // import { EventEmitter2 } from "@nestjs/event-emitter";
// // import { UserEvent } from "../../../../modules/auth/events/events.enum";
// // import { CreateProfileDto } from "../dtos/create-profile.dto";
//
// @Injectable()
// export class ProfileService extends EntityService<Profile> {
//     constructor(
//         @InjectRepository(ProfileRepository) private readonly profileRepository: ProfileRepository,
//         protected readonly socketService: SocketService, // private readonly eventEmitter: EventEmitter2,
//     ) {
//         super(socketService, profileRepository, "user", "username");
//         // eventEmitter.on(UserEvent.USER_BEFORE_REGISTER, (createProfileDto: CreateProfileDto) => {
//         //     return new Promise((resolve: (value: Profile) => void, reject: (reason?: any) => void) => {
//         //         this.create(createProfileDto)
//         //             .then((profile) => resolve(profile))
//         //             .catch((err) => reject(err));
//         //     });
//         // });
//     }
// }
