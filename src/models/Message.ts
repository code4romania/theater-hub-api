import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn }  from "typeorm";
import { User }                                                           from "./User";
import { BaseEntity }                                                     from "./BaseEntity";

@Entity("Message")
export class Message extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  ID: string;

  @Column("varchar")
  Content: string;

  @ManyToOne(type => User, user => user.SentMessages)
  @JoinColumn({ name: "SenderID" })
  Sender: User;

  @ManyToOne(type => User, user => user.ReceivedMessages)
  @JoinColumn({ name: "RecipientID" })
  Recipient: User;
}
