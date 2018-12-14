import { CreateDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";

export abstract class BaseEntity {

    @CreateDateColumn()
    DateCreated?: Date;

    @UpdateDateColumn()
    DateUpdated?: Date;

    @VersionColumn()
    Version?: number;
}
