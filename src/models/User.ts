import { Entity, Column, PrimaryGeneratedColumn,
   OneToOne, OneToMany, JoinColumn }  from "typeorm";
import { BaseEntity }                 from "./BaseEntity";
import { UserImage }                  from "./UserImage";
import { UserVideo }                  from "./UserVideo";
import { Award }                      from "./Award";
import { UserSocialMedia }            from "./UserSocialMedia";
import { Wish }                       from "./Wish";
import { UserProject }                from "./UserProject";
import { Comment }                    from "./Comment";
import { Message }                    from "./Message";
import { Professional }               from "./Professional";
import { Sponsor }                    from "./Sponsor";
import { Institution }                from "./Institution";
import { UserAccountSettings }        from "./UserAccountSettings";

@Entity("User")
export class User extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar")
  Name: string;

  @Column("varchar", { length: 100 })
  Email: string;

  @Column("varchar")
  PasswordHash: string;

  @OneToOne(type => UserImage, { cascade: true, eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "ProfileImageID" })
  ProfileImage: UserImage;

  @Column("varchar", { nullable: true })
  Description: string;

  @Column("timestamp with time zone", { nullable: true })
  BirthDate: Date;

  @Column("varchar", { nullable: true })
  PhoneNumber: string;

  @Column("varchar", { nullable: true })
  Website: string;

  @OneToMany(type => UserImage, userImage => userImage.User, { cascade: true, eager: true })
  PhotoGallery?: UserImage[];

  @OneToMany(type => UserVideo, userVideo => userVideo.User, { cascade: true, eager: true })
  VideoGallery?: UserVideo[];

  @OneToMany(type => Award, award => award.User, { cascade: true, eager: true })
  Awards: Award[];

  @OneToMany(type => UserSocialMedia, userSocialMedia => userSocialMedia.User, { cascade: true, eager: true })
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

  @OneToOne(type => Professional, professional => professional.User, { cascade: true, eager: true })
  Professional?: Professional;

  @OneToOne(type => Sponsor, sponsor => sponsor.User)
  Sponsor?: Sponsor;

  @OneToOne(type => Institution, institution => institution.User, { eager: true })
  Institution?: Institution;

  @OneToOne(type => UserAccountSettings, accountSettings => accountSettings.User, { cascade: true, eager: true })
  AccountSettings?: UserAccountSettings;

}
