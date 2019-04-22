import { CommunitySkillLayer } from "./index";
import { User }                from "../../models";

export class GetCommunityLayersResponse {

    public constructor() {
        this.Layers = [];
    }

    public Layers: CommunitySkillLayer[];
}
