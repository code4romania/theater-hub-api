import { Entity, Column,
    PrimaryGeneratedColumn,
    ManyToOne, JoinColumn }  from "typeorm";
import { BaseEntity }        from "./BaseEntity";
import { Project }           from "./Project";

@Entity("ProjectUpdate")
export class ProjectUpdate extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    ID: string;

    @Column("varchar", { length: 500 })
    Description: string;

    @ManyToOne(type => Project, project => project.Updates, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ProjectID" })
    Project: Project;

}
