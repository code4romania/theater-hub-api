import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn }  from "typeorm";
import { BaseEntity }                                                    from "./BaseEntity";
import { User }                                                          from "./User";

@Entity("Sponsor")
export class Sponsor extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    ID: string;

    @OneToOne(type => User, user => user.Sponsor)
    @JoinColumn({ name: "UserID" })
    User: User;
}
