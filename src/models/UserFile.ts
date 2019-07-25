import { Entity, Column, PrimaryGeneratedColumn,
                                        ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity }                                           from "./BaseEntity";
import { User }                                                 from "./User";
import { FileCategoryType }                                     from "../enums";

@Entity("UserFile")
export class UserFile extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    ID: string;

    @Column("varchar")
    Key: string;

    @Column("varchar")
    Location: string;

    @Column()
    FileCategory: FileCategoryType;

    @ManyToOne(type => User, user => user.Files, { onDelete: "CASCADE" })
    @JoinColumn({ name: "UserID" })
    User: User;
}
