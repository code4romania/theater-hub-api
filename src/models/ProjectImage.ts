import { Entity, Column,
    PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity }      from "./BaseEntity";

@Entity("ProjectImage")
export class ProjectImage extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    ID: string;

    @Column("varchar")
    Key: string;

    @Column("varchar")
    Location: string;

    @Column("varchar")
    ThumbnailLocation: string;

    @Column("decimal", { scale: 2 })
    Size: number;

}
