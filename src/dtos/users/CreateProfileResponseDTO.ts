import { MeDTO }        from "./MeDTO";
import { LocaleType }   from "../../enums/LocaleType";

export class CreateProfileResponseDTO {

    public Token: string;

    public Locale: LocaleType;

    public Me: MeDTO;

}
