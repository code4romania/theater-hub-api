import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("Currency")
export class Currency {

    @PrimaryColumn("varchar", { length: 10 })
    ID: string;

    @Column("varchar", { length: 100 })
    Name: string;

}
