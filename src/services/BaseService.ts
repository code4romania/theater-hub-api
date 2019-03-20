import { injectable }           from "inversify";
import { IBaseService }         from "./IBaseService";
import { ILocalizationService } from "./ILocalizationService";
import { IBaseRepository }      from "../repositories";
import { BaseEntity }           from "../models";
import { LocaleType }           from "../enums";

@injectable()
export class BaseService<T extends BaseEntity> implements IBaseService<T> {

    protected readonly _repository: IBaseRepository<T>;
    protected readonly _localizationService: ILocalizationService;

    constructor(repository: IBaseRepository<T>, localizationService: ILocalizationService) {
        this._repository            = repository;
        this._localizationService   = localizationService;
    }

    public async create(entity: T): Promise<T> {
        return this._repository.insert(entity);
    }

    public async getAll(): Promise<T[]> {
        return this._repository.getAll();
    }

    public async getByID(id: string): Promise<T> {
        return this._repository.getByID(id);
    }

    public async update(entity: T): Promise<T> {
        return this._repository.update(entity);
    }

    public async delete(entity: T): Promise<T> {
        return this._repository.delete(entity);
    }

    public async deleteByID(id: string): Promise<T> {
        return this._repository.deleteByID(id);
    }

    public setLocale(locale: LocaleType): void {
        this._localizationService.setLocale(locale);
    }

}
