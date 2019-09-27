import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("ProjectNeedTagCategory")
export class ProjectNeedTagCategory {

  @PrimaryColumn("varchar", { length: 20 })
  ID: string;

  @Column("varchar", { length: 100 })
  Name: string;

  @Column("varchar", { length: 20 })
  Color: string;

  @Column("varchar", { length: 20 })
  BackgroundColor: string;
}
