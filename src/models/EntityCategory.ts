import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";

@Entity("EntityCategory")
export class EntityCategory {

  @PrimaryColumn()
  ID: number;

  @Column("varchar", { length: 100 })
  Name: string;

  @ManyToOne(type => EntityCategory, entityCategory => entityCategory.Children)
  @JoinColumn({ name: "ParentID" })
  Parent: EntityCategory;

  @OneToMany(type => EntityCategory, entityCategory => entityCategory.Parent)
  Children: EntityCategory[];
}
