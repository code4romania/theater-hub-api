import { Entity, Column, PrimaryGeneratedColumn,
                    ManyToOne, JoinColumn }  from "typeorm";
import { Project }                           from "./Project";

@Entity("ProjectNeed")
export class ProjectNeed {

    @PrimaryGeneratedColumn("uuid")
    ID: string;

    @Column("varchar", { length: 500 })
    Description: string;

    @Column("boolean")
    IsMandatory: boolean;

    @ManyToOne(type => Project, project => project.Needs, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ProjectID" })
    Project: Project;

}
