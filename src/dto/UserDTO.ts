import { UserRoleType } from "../enums/UserRoleType";

export class UserDTO {
    public ID: string;

    public Description: string;

    public Email: string;

    public Phone: string;

    public Website: string;

    public Role: UserRoleType;
}