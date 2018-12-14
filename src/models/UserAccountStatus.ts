import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("UserAccountStatus")
export class UserAccountStatus {

    @PrimaryColumn()
    ID: number;

    @Column("varchar", { length: 100 })
    Name: string;
}
