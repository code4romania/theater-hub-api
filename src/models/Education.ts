import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Professional }                                                  from "./Professional";
import { BaseEntity }                                                    from "./BaseEntity";

@Entity("Education")
export class Education extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar", { length: 100 })
  Title: string;

  @Column("varchar", { length: 100 })
  Institution: string;

  @Column("varchar")
  Description: string;

  @Column("timestamp with time zone")
  StartDate: Date;

  @Column("timestamp with time zone", { nullable: true })
  EndDate: Date;

  @ManyToOne(type => Professional, professional => professional.Education, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ProfessionalID" })
  Professional: Professional;

}
