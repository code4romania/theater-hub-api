import { Entity, Column, PrimaryGeneratedColumn,
   OneToOne, OneToMany, JoinColumn }  from "typeorm";
import { BaseEntity }                 from "./BaseEntity";
import { UserImage }                  from "./UserImage";
import { UserVideo }                  from "./UserVideo";
import { UserSocialMedia }            from "./UserSocialMedia";
import { Wish }                       from "./Wish";
import { UserProject }                from "./UserProject";
import { Comment }                    from "./Comment";
import { Message }                    from "./Message";
import { Professional }               from "./Professional";
import { Sponsor }                    from "./Sponsor";
import { Theater }                    from "./Theater";
import { UserRoleType }               from "../enums/UserRoleType";

@Entity("User")
export class User extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar")
  Description: string;

  @Column("varchar", { length: 100 })
  Email: string;

  @Column("varchar", { nullable: true })
  Phone: string;

  @Column("varchar", { nullable: true })
  Website: string;

  @Column("boolean")
  IsActive: boolean;

  @Column()
  Role?: UserRoleType;

  @OneToMany(type => UserImage, userImage => userImage.User)
  PhotoGallery?: UserImage[];

  @OneToMany(type => UserVideo, userVideo => userVideo.User)
  VideoGallery?: UserVideo[];

  @OneToMany(type => UserSocialMedia, userSocialMedia => userSocialMedia.User)
  SocialMedia?: UserSocialMedia[];

  @OneToMany(type => Wish, wish => wish.User)
  Wishes?: Wish[];

  @OneToMany(type => Wish, wish => wish.Sponsor)
  SponsoredWishes?: Wish[];

  @OneToMany(type => UserProject, userProject => userProject.Member)
  Projects?: UserProject[];

  @OneToMany(type => Comment, comment => comment.User)
  Comments?: Comment[];

  @OneToMany(type => Message, message => message.Sender)
  SentMessages?: Message[];

  @OneToMany(type => Message, message => message.Recipient)
  ReceivedMessages?: Message[];

  @OneToOne(type => Professional, professional => professional.User)
  Professional?: Professional;

  @OneToOne(type => Sponsor, sponsor => sponsor.User)
  Sponsor?: Sponsor;

  @OneToOne(type => Theater, theater => theater.User)
  Theater?: Theater;
}