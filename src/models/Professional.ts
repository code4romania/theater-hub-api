import { Entity, Column,
       PrimaryGeneratedColumn,
       OneToOne, OneToMany,
       ManyToMany, JoinColumn,
       JoinTable }                 from "typeorm";
import { BaseEntity }              from "./BaseEntity";
import { Experience }              from "./Experience";
import { Education }               from "./Education";
import { Skill }                   from "./Skill";
import { User }                    from "./User";

@Entity("Professional")
export class Professional extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar", { length: 100 })
  FirstName: string;

  @Column("varchar", { length: 100 })
  LastName: string;

  @OneToOne(type => User, user => user.Professional, { onDelete: "CASCADE" })
  @JoinColumn({ name: "UserID" })
  User: User;

  @ManyToMany(type => Skill, { eager: true })
  @JoinTable({ name: "ProfessionalSkill" })
  Skills: Skill[];

  @OneToMany(type => Experience, experience => experience.Professional, { cascade: true, eager: true })
  Experience: Experience[];

  @OneToMany(type => Education, education => education.Professional, { cascade: true, eager: true })
  Education: Education[];

}
