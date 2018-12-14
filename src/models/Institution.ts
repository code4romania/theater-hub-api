import { Entity, Column, PrimaryGeneratedColumn,
             OneToOne, OneToMany, JoinColumn }  from "typeorm";
import { User }                                 from "./User";
import { ProfessionalInstitution }              from "./ProfessionalInstitution";
import { BaseEntity }                           from "./BaseEntity";

@Entity("Institution")
export class Institution extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar", { length: 100 })
  Name: string;

  @OneToOne(type => User, user => user.Institution)
  @JoinColumn({ name: "UserID" })
  User: User;

  @OneToMany(type => ProfessionalInstitution, professionalInstitution => professionalInstitution.Institution)
  Personnel: ProfessionalInstitution[];
}
