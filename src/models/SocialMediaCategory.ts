import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("SocialMediaCategory")
export class SocialMediaCategory {

  @PrimaryColumn()
  ID: number;

  @Column("varchar", { length: 100 })
  Name: string;
}
