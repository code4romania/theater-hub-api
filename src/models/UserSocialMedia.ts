import { Entity, Column, PrimaryColumn,
      ManyToOne, OneToOne, JoinColumn, Index } from "typeorm";
import { SocialMediaCategory }                 from "./SocialMediaCategory";
import { BaseEntity }                          from "./BaseEntity";
import { User}                                 from "./User";

@Entity("UserSocialMedia")
export class UserSocialMedia extends BaseEntity {

  @PrimaryColumn()
  UserID: string;

  @PrimaryColumn()
  SocialMediaCategoryID: number;

  @Column("varchar")
  Link: string;

  @ManyToOne(type => User, user => user.SocialMedia, { onDelete: "CASCADE" })
  @JoinColumn({ name: "UserID" })
  User: User;

  @ManyToOne(type => SocialMediaCategory)
  @JoinColumn({ name: "SocialMediaCategoryID" })
  SocialMediaCategory: SocialMediaCategory;

}
