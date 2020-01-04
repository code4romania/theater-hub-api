import { Entity, Column,
    OneToOne, JoinColumn,
    PrimaryGeneratedColumn }    from "typeorm";
import { BaseEntity }           from "./BaseEntity";
import { Project }              from "./Project";

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

    @OneToOne(type => Project, project => project.Image, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ProjectID" })
    Project: Project;

}
