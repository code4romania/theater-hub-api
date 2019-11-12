import { Entity, Column,
    PrimaryGeneratedColumn,
    ManyToMany, ManyToOne,
    JoinColumn, JoinTable }  from "typeorm";
import { BaseEntity }        from "./BaseEntity";
import { Project }           from "./Project";
import { Tag }               from "./Tag";

@Entity("ProjectNeed")
export class ProjectNeed extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    ID: string;

    @Column("varchar", { length: 500 })
    Description: string;

    @ManyToOne(type => Project, project => project.Needs, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ProjectID" })
    Project: Project;

    @ManyToMany(type => Tag, { eager: true })
    @JoinTable({ name: "ProjectNeedTag" })
    Tags?: Tag[];

}
