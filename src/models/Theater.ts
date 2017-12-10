import { Entity, Column, PrimaryGeneratedColumn,
             OneToOne, OneToMany, JoinColumn }  from "typeorm";
import { EntityCategory }                       from "./EntityCategory";
import { User }                                 from "./User";
import { ProfessionalTheater }                  from "./ProfessionalTheater";
import { BaseEntity }                           from "./BaseEntity";

@Entity("Theater")
export class Theater extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar", { length: 100 })
  Name: string;

  @OneToOne(type => EntityCategory)
  @JoinColumn({ name: "EntityCategoryID" })
  EntityCategory: EntityCategory;

  @OneToOne(type => User, user => user.Theater)
  @JoinColumn({ name: "UserID" })
  User: User;

  @OneToMany(type => ProfessionalTheater, professionalTheater => professionalTheater.Theater)
  Personnel: ProfessionalTheater[];
}
