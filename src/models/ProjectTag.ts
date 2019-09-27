import { Entity, PrimaryColumn,
      ManyToOne, JoinColumn }       from "typeorm";
import { ProjectTagCategory }       from "./ProjectTagCategory";
import { BaseEntity }               from "./BaseEntity";
import { Project}                   from "./Project";

@Entity("ProjectTag")
export class ProjectTag extends BaseEntity {

  @PrimaryColumn()
  ProjectID: string;

  @PrimaryColumn()
  ProjectTagCategoryID: string;

  @ManyToOne(type => Project, project => project.Tags, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ProjectID" })
  Project: Project;

  @ManyToOne(type => ProjectTagCategory)
  @JoinColumn({ name: "ProjectTagCategoryID" })
  ProjectTagCategory: ProjectTagCategory;

}
