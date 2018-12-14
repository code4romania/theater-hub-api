import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity }                                                    from "./BaseEntity";
import { User }                                                          from "./User";

@Entity("UserVideo")
export class UserVideo extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar")
  Video: string;

  @ManyToOne(type => User, user => user.VideoGallery, { onDelete: "CASCADE" })
  @JoinColumn({ name: "UserID" })
  User: User;
}
