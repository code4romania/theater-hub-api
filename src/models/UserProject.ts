import { Entity, Column, PrimaryGeneratedColumn,
                                  ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { BaseEntity }                                                    from "./BaseEntity";
import { User }                                                          from "./User";
import { Project }                                                       from "./Project";

@Entity("UserProject")
export class UserProject extends BaseEntity {

  @PrimaryColumn()
  MemberID: string;

  @PrimaryColumn()
  ProjectID: string;

  @Column("boolean")
  IsOwner: boolean;

  @ManyToOne(type => User, user => user.Projects)
  @JoinColumn({ name: "MemberID" })
  Member: User;

  @ManyToOne(type => Project, project => project.Members)
  @JoinColumn({ name: "ProjectID" })
  Project: Project;
}
