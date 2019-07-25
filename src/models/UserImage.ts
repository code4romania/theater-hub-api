import { Entity, Column, PrimaryGeneratedColumn,
                                        ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity }                                           from "./BaseEntity";
import { User }                                                 from "./User";

@Entity("UserImage")
export class UserImage extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar")
  Key: string;

  @Column("varchar")
  Location: string;

  @Column("varchar")
  ThumbnailLocation: string;

  @Column("decimal", { scale: 2 })
  Size: number;

  @Column("boolean")
  IsProfileImage?: boolean;

  @ManyToOne(type => User, user => user.PhotoGallery, { onDelete: "CASCADE" })
  @JoinColumn({ name: "UserID" })
  User: User;

}
