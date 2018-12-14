import { UserAccountStatusType, UserRoleType } from "../enums";

export interface Principal {

    FirstName: string;

    LastName: string;

    Email: string;

    Role: UserRoleType;

    AccountStatus: UserAccountStatusType;
}
