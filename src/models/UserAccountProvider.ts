import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("UserAccountProvider")
export class UserAccountProvider {

    @PrimaryColumn()
    ID: number;

    @Column("varchar", { length: 100 })
    Name: string;
}
