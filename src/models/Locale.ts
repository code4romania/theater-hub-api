import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("Locale")
export class Locale {

    @PrimaryColumn("varchar", { length: 10 })
    ID: string;

    @Column("varchar", { length: 100 })
    Name: string;

}
