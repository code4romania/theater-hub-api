import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1512896789160 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "Education" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Name" character varying(100) NOT NULL, "Title" character varying(100) NOT NULL, "StartDate" TIMESTAMP WITH TIME ZONE NOT NULL, "EndDate" TIMESTAMP WITH TIME ZONE NOT NULL, "ProfessionalID" uuid, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "EntityCategory" ("ID" integer NOT NULL, "Name" character varying(100) NOT NULL, "ParentID" integer, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "UserImage" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Image" bytea NOT NULL, "IsProfileImage" boolean NOT NULL, "UserID" uuid, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "UserVideo" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Link" character varying NOT NULL, "UserID" uuid, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "SocialMediaCategory" ("ID" integer NOT NULL, "Name" character varying(100) NOT NULL, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "UserSocialMedia" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "UserID" uuid NOT NULL, "SocialMediaCategoryID" integer NOT NULL, "Link" character varying NOT NULL, PRIMARY KEY("UserID", "SocialMediaCategoryID"))`);
        await queryRunner.query(`CREATE TABLE "Comment" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Content" character varying NOT NULL, "IsApproved" boolean NOT NULL, "UserID" uuid, "WishID" uuid, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "WishCategory" ("ID" integer NOT NULL, "Name" character varying(100) NOT NULL, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "Wish" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Title" character varying(100) NOT NULL, "Image" bytea, "Description" character varying NOT NULL, "CanPay" boolean NOT NULL, "IsUrgent" boolean NOT NULL, "WishCategoryID" integer, "UserID" uuid, "SponsorID" uuid, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "Project" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Name" character varying(100) NOT NULL, "Description" character varying NOT NULL, "Poster" character varying NOT NULL, "Date" TIMESTAMP WITH TIME ZONE NOT NULL, "Price" money, "Link" character varying, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "UserProject" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "MemberID" uuid NOT NULL, "ProjectID" uuid NOT NULL, "IsOwner" boolean NOT NULL, PRIMARY KEY("MemberID", "ProjectID"))`);
        await queryRunner.query(`CREATE TABLE "Message" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Content" character varying NOT NULL, "SenderID" uuid, "RecipientID" uuid, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "Sponsor" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "EntityCategoryID" integer, "UserID" uuid, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "User" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Description" character varying NOT NULL, "Email" character varying(100) NOT NULL, "Phone" character varying, "Website" character varying, "IsActive" boolean NOT NULL, "Role" integer NOT NULL, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "Theater" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Name" character varying(100) NOT NULL, "EntityCategoryID" integer, "UserID" uuid, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "ProfessionalTheater" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ProfessionalID" uuid NOT NULL, "TheaterID" uuid NOT NULL, "IsFounder" boolean NOT NULL, PRIMARY KEY("ProfessionalID", "TheaterID"))`);
        await queryRunner.query(`CREATE TABLE "Professional" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "FirstName" character varying(100) NOT NULL, "LastName" character varying(100) NOT NULL, "UserID" uuid, "EntityCategoryID" integer, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "Award" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Name" character varying(100) NOT NULL, "Date" TIMESTAMP WITH TIME ZONE NOT NULL, "ProfessionalID" uuid, PRIMARY KEY("ID"))`);
        await queryRunner.query(`CREATE TABLE "UserRole" ("ID" integer NOT NULL, "Name" character varying(100) NOT NULL, PRIMARY KEY("ID"))`);
        await queryRunner.query(`ALTER TABLE "Education" ADD CONSTRAINT "fk_673117580c07ea588ab055c4326" FOREIGN KEY ("ProfessionalID") REFERENCES "Professional"("ID")`);
        await queryRunner.query(`ALTER TABLE "EntityCategory" ADD CONSTRAINT "fk_a055775ff0c47a1f05720b543f6" FOREIGN KEY ("ParentID") REFERENCES "EntityCategory"("ID")`);
        await queryRunner.query(`ALTER TABLE "UserImage" ADD CONSTRAINT "fk_2d59d78ebb7db787315d0a13978" FOREIGN KEY ("UserID") REFERENCES "User"("ID")`);
        await queryRunner.query(`ALTER TABLE "UserVideo" ADD CONSTRAINT "fk_c349889e5c3b49448abe4e9b547" FOREIGN KEY ("UserID") REFERENCES "User"("ID")`);
        await queryRunner.query(`ALTER TABLE "UserSocialMedia" ADD CONSTRAINT "fk_b6b85940cb9dba6e0681e068b65" FOREIGN KEY ("UserID") REFERENCES "User"("ID")`);
        await queryRunner.query(`ALTER TABLE "UserSocialMedia" ADD CONSTRAINT "fk_1724bbb03e1c439c4e9df8f811d" FOREIGN KEY ("SocialMediaCategoryID") REFERENCES "SocialMediaCategory"("ID")`);
        await queryRunner.query(`ALTER TABLE "Comment" ADD CONSTRAINT "fk_8a03867de56076a65a0806dbf46" FOREIGN KEY ("UserID") REFERENCES "User"("ID")`);
        await queryRunner.query(`ALTER TABLE "Comment" ADD CONSTRAINT "fk_d543a9ee7dfe96acc26490b8f7a" FOREIGN KEY ("WishID") REFERENCES "Wish"("ID")`);
        await queryRunner.query(`ALTER TABLE "Wish" ADD CONSTRAINT "fk_2abd1b3072caa2b36620e766ff0" FOREIGN KEY ("WishCategoryID") REFERENCES "WishCategory"("ID")`);
        await queryRunner.query(`ALTER TABLE "Wish" ADD CONSTRAINT "fk_677e4fa9a0e72ae3530b5998dab" FOREIGN KEY ("UserID") REFERENCES "User"("ID")`);
        await queryRunner.query(`ALTER TABLE "Wish" ADD CONSTRAINT "fk_4f000bb765b1fbcc490978a8ac1" FOREIGN KEY ("SponsorID") REFERENCES "User"("ID")`);
        await queryRunner.query(`ALTER TABLE "UserProject" ADD CONSTRAINT "fk_e1fe1752b6e3d5ecb0da369ea50" FOREIGN KEY ("MemberID") REFERENCES "User"("ID")`);
        await queryRunner.query(`ALTER TABLE "UserProject" ADD CONSTRAINT "fk_0a6a9893ea6dc385a06a36bf4e7" FOREIGN KEY ("ProjectID") REFERENCES "Project"("ID")`);
        await queryRunner.query(`ALTER TABLE "Message" ADD CONSTRAINT "fk_12d579ef8c45ba601be9c4a3b11" FOREIGN KEY ("SenderID") REFERENCES "User"("ID")`);
        await queryRunner.query(`ALTER TABLE "Message" ADD CONSTRAINT "fk_1f8b3f0ff6c2fc26876cf11dfe7" FOREIGN KEY ("RecipientID") REFERENCES "User"("ID")`);
        await queryRunner.query(`ALTER TABLE "Sponsor" ADD CONSTRAINT "fk_eed93cf7cb8efb11a66aa19a70b" FOREIGN KEY ("EntityCategoryID") REFERENCES "EntityCategory"("ID")`);
        await queryRunner.query(`ALTER TABLE "Sponsor" ADD CONSTRAINT "fk_259b08e0bc90fff604e5e1768ce" FOREIGN KEY ("UserID") REFERENCES "User"("ID")`);
        await queryRunner.query(`ALTER TABLE "Theater" ADD CONSTRAINT "fk_2444c50e0f32bd552401943dc5c" FOREIGN KEY ("EntityCategoryID") REFERENCES "EntityCategory"("ID")`);
        await queryRunner.query(`ALTER TABLE "Theater" ADD CONSTRAINT "fk_fff9763d9943febfad891433598" FOREIGN KEY ("UserID") REFERENCES "User"("ID")`);
        await queryRunner.query(`ALTER TABLE "ProfessionalTheater" ADD CONSTRAINT "fk_a407683dc04cb1f902e3cc2e92b" FOREIGN KEY ("ProfessionalID") REFERENCES "Professional"("ID")`);
        await queryRunner.query(`ALTER TABLE "ProfessionalTheater" ADD CONSTRAINT "fk_057eabdcd211e39b1538c30f363" FOREIGN KEY ("TheaterID") REFERENCES "Theater"("ID")`);
        await queryRunner.query(`ALTER TABLE "Professional" ADD CONSTRAINT "fk_cb3abbb2f0efea2aefd55c43123" FOREIGN KEY ("UserID") REFERENCES "User"("ID")`);
        await queryRunner.query(`ALTER TABLE "Professional" ADD CONSTRAINT "fk_c79b3b22c6fec2128ddac7c223e" FOREIGN KEY ("EntityCategoryID") REFERENCES "EntityCategory"("ID")`);
        await queryRunner.query(`ALTER TABLE "Award" ADD CONSTRAINT "fk_90ca935a4fcd6c5e5b6c65a945c" FOREIGN KEY ("ProfessionalID") REFERENCES "Professional"("ID")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "Award" DROP CONSTRAINT "fk_90ca935a4fcd6c5e5b6c65a945c"`);
        await queryRunner.query(`ALTER TABLE "Professional" DROP CONSTRAINT "fk_c79b3b22c6fec2128ddac7c223e"`);
        await queryRunner.query(`ALTER TABLE "Professional" DROP CONSTRAINT "fk_cb3abbb2f0efea2aefd55c43123"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalTheater" DROP CONSTRAINT "fk_057eabdcd211e39b1538c30f363"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalTheater" DROP CONSTRAINT "fk_a407683dc04cb1f902e3cc2e92b"`);
        await queryRunner.query(`ALTER TABLE "Theater" DROP CONSTRAINT "fk_fff9763d9943febfad891433598"`);
        await queryRunner.query(`ALTER TABLE "Theater" DROP CONSTRAINT "fk_2444c50e0f32bd552401943dc5c"`);
        await queryRunner.query(`ALTER TABLE "Sponsor" DROP CONSTRAINT "fk_259b08e0bc90fff604e5e1768ce"`);
        await queryRunner.query(`ALTER TABLE "Sponsor" DROP CONSTRAINT "fk_eed93cf7cb8efb11a66aa19a70b"`);
        await queryRunner.query(`ALTER TABLE "Message" DROP CONSTRAINT "fk_1f8b3f0ff6c2fc26876cf11dfe7"`);
        await queryRunner.query(`ALTER TABLE "Message" DROP CONSTRAINT "fk_12d579ef8c45ba601be9c4a3b11"`);
        await queryRunner.query(`ALTER TABLE "UserProject" DROP CONSTRAINT "fk_0a6a9893ea6dc385a06a36bf4e7"`);
        await queryRunner.query(`ALTER TABLE "UserProject" DROP CONSTRAINT "fk_e1fe1752b6e3d5ecb0da369ea50"`);
        await queryRunner.query(`ALTER TABLE "Wish" DROP CONSTRAINT "fk_4f000bb765b1fbcc490978a8ac1"`);
        await queryRunner.query(`ALTER TABLE "Wish" DROP CONSTRAINT "fk_677e4fa9a0e72ae3530b5998dab"`);
        await queryRunner.query(`ALTER TABLE "Wish" DROP CONSTRAINT "fk_2abd1b3072caa2b36620e766ff0"`);
        await queryRunner.query(`ALTER TABLE "Comment" DROP CONSTRAINT "fk_d543a9ee7dfe96acc26490b8f7a"`);
        await queryRunner.query(`ALTER TABLE "Comment" DROP CONSTRAINT "fk_8a03867de56076a65a0806dbf46"`);
        await queryRunner.query(`ALTER TABLE "UserSocialMedia" DROP CONSTRAINT "fk_1724bbb03e1c439c4e9df8f811d"`);
        await queryRunner.query(`ALTER TABLE "UserSocialMedia" DROP CONSTRAINT "fk_b6b85940cb9dba6e0681e068b65"`);
        await queryRunner.query(`ALTER TABLE "UserVideo" DROP CONSTRAINT "fk_c349889e5c3b49448abe4e9b547"`);
        await queryRunner.query(`ALTER TABLE "UserImage" DROP CONSTRAINT "fk_2d59d78ebb7db787315d0a13978"`);
        await queryRunner.query(`ALTER TABLE "EntityCategory" DROP CONSTRAINT "fk_a055775ff0c47a1f05720b543f6"`);
        await queryRunner.query(`ALTER TABLE "Education" DROP CONSTRAINT "fk_673117580c07ea588ab055c4326"`);
        await queryRunner.query(`DROP TABLE "UserRole"`);
        await queryRunner.query(`DROP TABLE "Award"`);
        await queryRunner.query(`DROP TABLE "Professional"`);
        await queryRunner.query(`DROP TABLE "ProfessionalTheater"`);
        await queryRunner.query(`DROP TABLE "Theater"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "Sponsor"`);
        await queryRunner.query(`DROP TABLE "Message"`);
        await queryRunner.query(`DROP TABLE "UserProject"`);
        await queryRunner.query(`DROP TABLE "Project"`);
        await queryRunner.query(`DROP TABLE "Wish"`);
        await queryRunner.query(`DROP TABLE "WishCategory"`);
        await queryRunner.query(`DROP TABLE "Comment"`);
        await queryRunner.query(`DROP TABLE "UserSocialMedia"`);
        await queryRunner.query(`DROP TABLE "SocialMediaCategory"`);
        await queryRunner.query(`DROP TABLE "UserVideo"`);
        await queryRunner.query(`DROP TABLE "UserImage"`);
        await queryRunner.query(`DROP TABLE "EntityCategory"`);
        await queryRunner.query(`DROP TABLE "Education"`);
    }

}
