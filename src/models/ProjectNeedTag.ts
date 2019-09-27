import { Entity, PrimaryColumn,
      ManyToOne, JoinColumn }     from "typeorm";
import { ProjectNeedTagCategory } from "./ProjectNeedTagCategory";
import { BaseEntity }             from "./BaseEntity";
import { ProjectNeed}             from "./ProjectNeed";

@Entity("ProjectNeedTag")
export class ProjectNeedTag extends BaseEntity {

  @PrimaryColumn()
  ProjectNeedID: string;

  @PrimaryColumn()
  ProjectNeedTagCategoryID: string;

  @ManyToOne(type => ProjectNeed, projectNeed => projectNeed.Tags, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ProjectNeedID" })
  ProjectNeed: ProjectNeed;

  @ManyToOne(type => ProjectNeedTagCategory)
  @JoinColumn({ name: "ProjectNeedTagCategoryID" })
  ProjectNeedTagCategory: ProjectNeedTagCategory;
}
