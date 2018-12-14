import { UserRoleType } from "../../enums/UserRoleType";

export class UserDTO {

    public ID: string;

    public Description: string;

    public Email: string;

    public PhoneNumber: string;

    public Website: string;

    public Role: UserRoleType;
}
