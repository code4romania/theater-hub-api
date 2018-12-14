import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,
  OneToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity }               from "./BaseEntity";
import { User }                     from "./User";
import { Comment }                  from "./Comment";
import { WishCategory }             from "./WishCategory";

@Entity("Wish")
export class Wish extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar", { length: 100 })
  Title: string;

  @Column("bytea", { nullable: true })
  Image: string;

  @Column("varchar")
  Description: string;

  @Column("boolean")
  CanPay: boolean;

  @Column("boolean")
  IsUrgent: boolean;

  @OneToOne(type => WishCategory)
  @JoinColumn({ name: "WishCategoryID" })
  WishCategory: WishCategory;

  @ManyToOne(type => User, user => user.Wishes)
  @JoinColumn({ name: "UserID" })
  User: User;

  @ManyToOne(type => User, user => user.SponsoredWishes)
  @JoinColumn({ name: "SponsorID" })
  Sponsor: User;

  @OneToMany(type => Comment, comment => comment.Wish)
  Comments: Comment[];
}
