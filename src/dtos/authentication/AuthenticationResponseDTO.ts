import { UserImage }    from "../../models";
import { LocaleType }   from "../../enums/LocaleType";

export class AuthenticationResponseDTO {

    public Token: string;

    public Locale: LocaleType;

}
