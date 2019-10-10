import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { ProfessionalSkill }                        from "./ProfessionalSkill";

@Entity("Skill")
export class Skill {

    @PrimaryColumn()
    ID: number;

    @Column("varchar", { length: 100 })
    Name: string;

    @Column("bytea", { nullable: true })
    Image: string;

    @OneToMany(type => ProfessionalSkill, professionalSkill => professionalSkill.Skill)
    Professionals: ProfessionalSkill[];

}
