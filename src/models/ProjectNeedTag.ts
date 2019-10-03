import { Entity, PrimaryColumn,
      ManyToOne, JoinColumn }     from "typeorm";
import { Tag }                    from "./Tag";
import { BaseEntity }             from "./BaseEntity";
import { ProjectNeed}             from "./ProjectNeed";

@Entity("ProjectNeedTag")
export class ProjectNeedTag extends BaseEntity {

  @PrimaryColumn()
  ProjectNeedID: string;

  @PrimaryColumn()
  TagID: string;

  @ManyToOne(type => ProjectNeed, projectNeed => projectNeed.Tags, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ProjectNeedID" })
  ProjectNeed: ProjectNeed;

  @ManyToOne(type => Tag)
  @ManyToOne(type => Tag, tag => tag.ProjectNeeds, { eager: true })
  @JoinColumn({ name: "TagID" })
  Tag: Tag;
}
