import { Entity, Column, PrimaryGeneratedColumn,
                    ManyToOne, JoinColumn }  from "typeorm";
import { Project }                           from "./Project";

@Entity("ProjectUpdate")
export class ProjectUpdate {

    @PrimaryGeneratedColumn("uuid")
    ID: string;

    @Column("varchar", { length: 500 })
    Description: string;

    @Column("timestamp with time zone")
    Date: Date;

    @ManyToOne(type => Project, project => project.Updates, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ProjectID" })
    Project: Project;

}
