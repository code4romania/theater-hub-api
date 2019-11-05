import { Entity, Column, OneToMany, PrimaryColumn } from "typeorm";

@Entity("Tag")
export class Tag {

  @PrimaryColumn("varchar", { length: 20 })
  ID: string;

  @Column("varchar", { length: 100 })
  Name: string;

  @Column("varchar", { length: 20 })
  Color: string;

  @Column("varchar", { length: 20 })
  BackgroundColor: string;

}
