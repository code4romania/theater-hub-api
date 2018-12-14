import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User }                from "./User";
import { Wish }                from "./Wish";
import { BaseEntity }          from "./BaseEntity";


@Entity("Comment")
export class Comment extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar")
  Content: string;

  @Column("boolean")
  IsApproved: boolean;

  @ManyToOne(type => User, user => user.Comments)
  @JoinColumn({ name: "UserID" })
  User: User;

  @ManyToOne(type => Wish, wish => wish.Comments)
  @JoinColumn({ name: "WishID" })
  Wish: Wish;
}
