import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Professional }                                                  from "./Professional";
import { BaseEntity }                                                    from "./BaseEntity";

@Entity("Education")
export class Education extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar", { length: 100 })
  Name: string;

  @Column("varchar", { length: 100 })
  Title: string;

  @Column("timestamp with time zone")
  StartDate: Date;

  @Column("timestamp with time zone")
  EndDate: Date;

  @ManyToOne(type => Professional, professional => professional.Education)
  @JoinColumn({ name: "ProfessionalID" })
  Professional: Professional;
}