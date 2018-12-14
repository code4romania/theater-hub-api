import { Entity, Column, ManyToOne, JoinColumn,
                                    PrimaryColumn }  from "typeorm";
import { Professional }                              from "./Professional";
import { Institution }                               from "./Institution";
import { BaseEntity }                                from "./BaseEntity";

@Entity("ProfessionalInstitution")
export class ProfessionalInstitution extends BaseEntity {

  @PrimaryColumn()
  ProfessionalID: string;

  @PrimaryColumn()
  InstitutionID: string;

  @ManyToOne(type => Professional, professional => professional.Institutions)
  @JoinColumn({ name: "ProfessionalID" })
  Professional: Professional;

  @ManyToOne(type => Institution, institution => institution.Personnel)
  @JoinColumn({ name: "InstitutionID" })
  Institution: Institution;

  @Column("boolean")
  IsFounder: boolean;
}
