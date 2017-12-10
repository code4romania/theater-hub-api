import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn }  from "typeorm";
import { Professional }                                                   from "./Professional";
import { BaseEntity }                                                     from "./BaseEntity";

@Entity("Award")
export class Award extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar", { length: 100 })
  Name: string;

  @Column("timestamp with time zone")
  Date: Date;

  @ManyToOne(type => Professional, professional => professional.Awards)
  @JoinColumn({ name: "ProfessionalID" })
  Professional: Professional;
}