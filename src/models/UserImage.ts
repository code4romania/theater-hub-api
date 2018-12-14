import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity }                                                    from "./BaseEntity";
import { User }                                                          from "./User";

@Entity("UserImage")
export class UserImage extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("bytea")
  Image: string;

  @Column("boolean")
  IsProfileImage?: boolean;

  @ManyToOne(type => User, user => user.PhotoGallery, { onDelete: "CASCADE" })
  @JoinColumn({ name: "UserID" })
  User: User;

}
