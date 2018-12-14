import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("UserRole")
export class UserRole {

    @PrimaryColumn()
    ID: number;

    @Column("varchar", { length: 100 })
    Name: string;
}
