import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("WishCategory")
export class WishCategory {

  @PrimaryColumn()
  ID: number;

  @Column("varchar", { length: 100 })
  Name: string;
}
