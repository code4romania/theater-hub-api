import { getRepository, Repository }     from "typeorm";
import { injectable }                    from "inversify";
import { EntityCategory }                from "../models/EntityCategory";
import { IEntityCategoryRepository }     from "../contracts";

@injectable()
export class EntityCategoryRepository implements IEntityCategoryRepository {

    private readonly _entityCategoryRepository: Repository<EntityCategory>;

    constructor() {
        this._entityCategoryRepository = getRepository(EntityCategory);
    }

    public async getAll(): Promise<EntityCategory[]> {
        return await this._entityCategoryRepository.find();
    }

    public async getByID(id: string): Promise<EntityCategory> {
        return await this._entityCategoryRepository.findOne(id);
    }

    public async getByIDs(ids: string[]): Promise<EntityCategory[]> {
        return await this._entityCategoryRepository.findByIds(ids);
    }
}
