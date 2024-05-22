import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { UserSessionType } from "../types/User";
import { User } from "./User";

@Entity({ tableName: "user_session" })
export class Session implements UserSessionType {
    @PrimaryKey({
        name: "session_id",
        type: "string",
        comment: "The session id",
    })
    session_id!: string;

    @Property({
        name: "user_id",
        type: "string",
        comment: "The user id associated with the session",
    })
    user_id!: string;

    @OneToOne(() => User, user => user.session)
    user!: User;

    @Property({
        name: "login_time",
        type: "date",
        comment: "The login time of the session",
    })
    login_time!: Date;

    @Property({
        name: "duration",
        type: "number",
        comment: "The duration of the session",
    })
    duration!: number;

    @Property({
        name: "device_info",
        type: "object",
        comment: "Information about the device used for the session",
    })
    device_info!: {
        device_type: string;
        browser: string;
        operating_system: string;
        resolution: {
            width: number;
            height: number;
        };
        network_info: {
            connection_type: string;
            carrier: string;
            ip_address: string;
        };
    };

    constructor(session: UserSessionType) {
        Object.assign(this, session);
    }
}
