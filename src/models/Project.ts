import { Entity, Column, PrimaryGeneratedColumn, OneToMany }  from "typeorm";
import { UserProject }                                        from "./UserProject";
import { BaseEntity }                                         from "./BaseEntity";

@Entity("Project")
export class Project extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar", { length: 100 })
  Name: string;

  @Column("varchar")
  Description: string;

  @Column("varchar")
  Poster: string;

  @Column("timestamp with time zone")
  Date: Date;

  @Column("money", { nullable: true })
  Price: number;

  @Column("varchar", { nullable: true })
  Link: string;

  @OneToMany(type => UserProject, userProject => userProject.Project)
  Members: UserProject[];
}