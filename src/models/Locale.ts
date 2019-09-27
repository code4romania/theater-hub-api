import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("Locale")
export class Locale {

    @PrimaryColumn("varchar", { length: 20 })
    ID: string;

    @Column("varchar", { length: 100 })
    Name: string;

}
