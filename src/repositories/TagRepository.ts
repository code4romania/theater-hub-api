import { getRepository, Repository }            from "typeorm";
import { injectable }                           from "inversify";
import { Tag }                                  from "../models";
import { ITagRepository }                       from "../contracts";

@injectable()
export class TagRepository implements ITagRepository {

    private readonly _tagRepository: Repository<Tag>;

    constructor() {
        this._tagRepository = getRepository(Tag);
    }

    public async getAll(): Promise<Tag[]> {
        return await this._tagRepository.find();
    }

    public async getByID(id: string): Promise<Tag> {
        return await this._tagRepository.findOne(id);
    }

    public async getByIDs(ids: string[]): Promise<Tag[]> {
        return await this._tagRepository.findByIds(ids);
    }
}
