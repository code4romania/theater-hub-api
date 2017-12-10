import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity }                                                    from "./BaseEntity";
import { User }                                                          from "./User";

@Entity("UserVideo")
export class UserVideo extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar")
  Link: string;

  @ManyToOne(type => User, user => user.VideoGallery)
  @JoinColumn({ name: "UserID" })
  User: User;
}