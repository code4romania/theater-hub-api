import { Entity, Column, PrimaryGeneratedColumn, OneToOne,
       OneToMany, JoinColumn }     from "typeorm";
import { BaseEntity }              from "./BaseEntity";
import { Experience }              from "./Experience";
import { Education }               from "./Education";
import { User }                    from "./User";
import { ProfessionalSkill }       from "./ProfessionalSkill";

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

  @OneToMany(type => ProfessionalSkill, professionalSkill => professionalSkill.Professional, { cascade: true, eager: true })
  Skills: ProfessionalSkill[];

  @OneToMany(type => Experience, experience => experience.Professional, { cascade: true, eager: true })
  Experience: Experience[];

  @OneToMany(type => Education, education => education.Professional, { cascade: true, eager: true })
  Education: Education[];

}
