import { Entity, Column, Index,
    PrimaryGeneratedColumn,
    OneToOne, OneToMany, JoinColumn } from "typeorm";
import { BaseEntity }                 from "./BaseEntity";
import { UserFile }                   from "./UserFile";
import { UserImage }                  from "./UserImage";
import { UserVideo }                  from "./UserVideo";
import { Award }                      from "./Award";
import { UserSocialMedia }            from "./UserSocialMedia";
import { Professional }               from "./Professional";
import { UserAccountSettings }        from "./UserAccountSettings";
import { Project }                    from "./Project";

@Entity("User")
export class User extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar")
  Name: string;

  @Index({ unique: true })
  @Column("varchar", { length: 100 })
  Email: string;

  @Column("varchar", { length: 100 })
  Username: string;

  @Column("varchar")
  PasswordHash: string;

  @OneToOne(type => UserImage, { cascade: true, eager: true })
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

  @OneToMany(type => UserFile, userFile => userFile.User, { cascade: true, eager: true })
  Files?: UserFile[];

  @OneToMany(type => Award, award => award.User, { cascade: true, eager: true })
  Awards: Award[];

  @OneToMany(type => UserSocialMedia, userSocialMedia => userSocialMedia.User, { cascade: true, eager: true })
  SocialMedia?: UserSocialMedia[];

  @OneToMany(type => Project, project => project.Initiator, { cascade: true, eager: true })
  Projects?: Project[];

  @OneToOne(type => Professional, professional => professional.User, { cascade: true, eager: true })
  Professional?: Professional;

  @OneToOne(type => UserAccountSettings, accountSettings => accountSettings.User, { cascade: true, eager: true })
  AccountSettings?: UserAccountSettings;

}
