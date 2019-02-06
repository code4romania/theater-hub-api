import { DashboardUser }    from "./DashboardUser";
import { User }             from "../../models";

export class GetUsersResponseDTO {

    public constructor(users: User[], total: number, page: number) {
        this.Data   = users.map(u => new DashboardUser(u));
        this.Total  = total;
        this.Page   = page;
    }

    public Data: DashboardUser[];

    public Total: number;

    public Page: number;

}
