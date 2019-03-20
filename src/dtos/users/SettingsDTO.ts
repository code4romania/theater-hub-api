import { VisibilityType, LocaleType }    from "../../enums";

export class SettingsDTO {

    public ProfileVisibility?: VisibilityType;

    public EmailVisibility?: VisibilityType;

    public BirthDateVisibility?: VisibilityType;

    public PhoneNumberVisibility?: VisibilityType;

    public Locale: LocaleType;

}
