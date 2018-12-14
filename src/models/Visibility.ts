import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("Visibility")
export class Visibility {

    @PrimaryColumn()
    ID: number;

    @Column("varchar", { length: 100 })
    Name: string;
}
