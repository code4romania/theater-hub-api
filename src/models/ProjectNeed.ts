import { Entity, Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne, JoinColumn }  from "typeorm";
import { BaseEntity }        from "./BaseEntity";
import { Project }           from "./Project";
import { ProjectNeedTag }    from "./ProjectNeedTag";

@Entity("ProjectNeed")
export class ProjectNeed extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    ID: string;

    @Column("varchar", { length: 500 })
    Description: string;

    @ManyToOne(type => Project, project => project.Needs, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ProjectID" })
    Project: Project;

    @OneToMany(type => ProjectNeedTag, projectNeedTag => projectNeedTag.ProjectNeed, { cascade: true, eager: true })
    Tags?: ProjectNeedTag[];

}
