import { ProfileDTO }         from "./ProfileDTO";
import { ProfileSectionType } from "../../enums";

export class UpdateProfileSection<T> {

    public AddedEntities: T[];

    public RemovedEntities: string[];

    public UpdatedEntities: T[];
}
