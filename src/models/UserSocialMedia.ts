import { Entity, Column, PrimaryColumn,
             ManyToOne, OneToOne, JoinColumn } from "typeorm";
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

  @ManyToOne(type => User, user => user.SocialMedia)
  @JoinColumn({ name: "UserID" })
  User: User;

  @OneToOne(type => SocialMediaCategory)
  @JoinColumn({ name: "SocialMediaCategoryID" })
  SocialMediaCategory: SocialMediaCategory;


}
