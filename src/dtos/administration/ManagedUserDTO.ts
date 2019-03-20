import { LocaleType, UserRoleType } from "../../enums";

export class ManagedUserDTO {

    public Email: string;

    public Role?: UserRoleType;

    public Locale?: LocaleType;

}
