import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn }  from "typeorm";
import { Professional }                                          from "./Professional";
import { Skill }                                                 from "./Skill";
import { BaseEntity }                                            from "./BaseEntity";

@Entity("ProfessionalSkill")
export class ProfessionalSkill extends BaseEntity {

    @PrimaryColumn()
    ProfessionalID: string;

    @PrimaryColumn()
    SkillID: number;

    @ManyToOne(type => Professional, professional => professional.Skills, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ProfessionalID" })
    Professional: Professional;

    @ManyToOne(type => Skill, skill => skill.Professionals, { eager: true })
    @JoinColumn({ name: "SkillID" })
    Skill: Skill;

}
