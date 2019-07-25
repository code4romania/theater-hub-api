import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("FileCategory")
export class FileCategory {

  @PrimaryColumn()
  ID: number;

  @Column("varchar", { length: 100 })
  Name: string;
}
