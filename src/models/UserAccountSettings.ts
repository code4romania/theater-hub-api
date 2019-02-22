import { Entity, PrimaryGeneratedColumn, Column,
                           OneToOne, JoinColumn }     from "typeorm";
import { BaseEntity }                                 from "./BaseEntity";
import { User }                                       from "./User";
import { UserAccountProviderType }                    from "../enums/UserAccountProviderType";
import { UserAccountStatusType }                      from "../enums/UserAccountStatusType";
import { UserRoleType }                               from "../enums/UserRoleType";
import { VisibilityType }                             from "../enums/VisibilityType";
import { EntityCategoryType }                         from "../enums/EntityCategoryType";


@Entity("UserAccountSettings")
export class UserAccountSettings extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    ID: string;

    @Column("varchar")
    RegistrationIDHash: string;

    @Column("varchar", { nullable: true })
    ResetForgottenPasswordIDHash: string;

    @Column("timestamp with time zone", { nullable: true })
    ResetForgottenPasswordExpiration: Date;

    @Column()
    AccountProvider: UserAccountProviderType;

    @Column()
    AccountStatus: UserAccountStatusType;

    @Column()
    Role?: UserRoleType;

    @Column()
    EntityCategory: EntityCategoryType;

    @Column()
    ProfileVisibility: VisibilityType;

    @Column()
    EmailVisibility: VisibilityType;

    @Column()
    BirthDateVisibility: VisibilityType;

    @Column()
    PhoneNumberVisibility: VisibilityType;

    @OneToOne(type => User, user => user.AccountSettings, { onDelete: "CASCADE" })
    @JoinColumn({ name: "UserID" })
    User: User;

}
