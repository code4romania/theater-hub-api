import { UserRoleType } from "../../enums";

export class ManagedUserRegistrationResponseDTO {

    public Role: UserRoleType;

    public Token: string;
}
