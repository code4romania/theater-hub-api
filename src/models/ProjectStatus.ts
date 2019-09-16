import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("ProjectStatus")
export class ProjectStatus {

    @PrimaryColumn()
    ID: number;

    @Column("varchar", { length: 100 })
    Name: string;
}
