import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, PrimaryColumn,
              CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Professional }                            from "./Professional";
import { Theater }                                 from "./Theater";
import { BaseEntity }                              from "./BaseEntity";

@Entity("ProfessionalTheater")
export class ProfessionalTheater extends BaseEntity {

  @PrimaryColumn()
  ProfessionalID: string;

  @PrimaryColumn()
  TheaterID: string;

  @ManyToOne(type => Professional, professional => professional.Theaters)
  @JoinColumn({ name: "ProfessionalID" })
  Professional: Professional;

  @ManyToOne(type => Theater, theater => theater.Personnel)
  @JoinColumn({ name: "TheaterID" })
  Theater: Theater;

  @Column("boolean")
  IsFounder: boolean;
}
