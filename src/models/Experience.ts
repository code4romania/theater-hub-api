import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Professional }                                                  from "./Professional";
import { BaseEntity }                                                    from "./BaseEntity";

@Entity("Experience")
export class Experience extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar", { length: 100 })
  Position: string;

  @Column("varchar", { length: 100 })
  Employer: string;

  @Column("varchar")
  Description: string;

  @Column("timestamp with time zone")
  StartDate: Date;

  @Column("timestamp with time zone", { nullable: true })
  EndDate: Date;

  @ManyToOne(type => Professional, professional => professional.Experience, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ProfessionalID" })
  Professional: Professional;

}
