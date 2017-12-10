import { Entity, Column, PrimaryGeneratedColumn, OneToOne,
       OneToMany, JoinColumn } from "typeorm";
import { BaseEntity }          from "./BaseEntity";
import { Award }               from "./Award";
import { Education }           from "./Education";
import { ProfessionalTheater } from "./ProfessionalTheater";
import { User }                from "./User";
import { EntityCategory }      from "./EntityCategory";

@Entity("Professional")
export class Professional extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar", { length: 100 })
  FirstName: string;

  @Column("varchar", { length: 100 })
  LastName: string;

  @OneToOne(type => User, user => user.Professional)
  @JoinColumn({ name: "UserID" })
  User: User;

  @OneToOne(type => EntityCategory)
  @JoinColumn({ name: "EntityCategoryID" })
  EntityCategory: EntityCategory;

  @OneToMany(type => Award, award => award.Professional)
  Awards: Award[];

  @OneToMany(type => Education, education => education.Professional)
  Education: Education[];

  @OneToMany(type => ProfessionalTheater, professionalTheater => professionalTheater.Professional)
  Theaters: ProfessionalTheater[];
}
