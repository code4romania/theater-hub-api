import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1576327616219 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "UserFile" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Key" character varying NOT NULL, "Location" character varying NOT NULL, "FileCategory" integer NOT NULL, "UserID" uuid, CONSTRAINT "PK_38196a9bc4691af4ca2c1ecaf6c" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "UserImage" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Key" character varying NOT NULL, "Location" character varying NOT NULL, "ThumbnailLocation" character varying NOT NULL, "Size" numeric NOT NULL, "IsProfileImage" boolean NOT NULL, "UserID" uuid, CONSTRAINT "PK_a7b8f73d33c3a99ca1b1145eeb6" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "UserVideo" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Title" character varying, "Video" character varying NOT NULL, "UserID" uuid, CONSTRAINT "PK_afe257e031009d04dcdbcf8f3e9" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "SocialMediaCategory" ("ID" integer NOT NULL, "Name" character varying(100) NOT NULL, CONSTRAINT "PK_cf1d1f90a6fcf11b8f6047fa69b" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "UserSocialMedia" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "UserID" uuid NOT NULL, "SocialMediaCategoryID" integer NOT NULL, "Link" character varying NOT NULL, CONSTRAINT "PK_f06d4ce569983cf889932e3578c" PRIMARY KEY ("UserID", "SocialMediaCategoryID"))`);
        await queryRunner.query(`CREATE TABLE "Experience" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Position" character varying(100) NOT NULL, "Employer" character varying(100) NOT NULL, "Description" character varying NOT NULL, "StartDate" TIMESTAMP WITH TIME ZONE NOT NULL, "EndDate" TIMESTAMP WITH TIME ZONE, "ProfessionalID" uuid, CONSTRAINT "PK_7daa9b4a1f6cccf187917bc37eb" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "Education" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Title" character varying(100) NOT NULL, "Institution" character varying(100) NOT NULL, "Description" character varying NOT NULL, "StartDate" TIMESTAMP WITH TIME ZONE NOT NULL, "EndDate" TIMESTAMP WITH TIME ZONE, "ProfessionalID" uuid, CONSTRAINT "PK_d4ffdad99662d98671e73aa200a" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "Skill" ("ID" integer NOT NULL, "Name" character varying(100) NOT NULL, "Image" bytea, CONSTRAINT "PK_4a7680fc6e4ae95640c4290ca9a" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "Professional" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "FirstName" character varying(100) NOT NULL, "LastName" character varying(100) NOT NULL, "UserID" uuid, CONSTRAINT "REL_8ed7e58c98b95d0ae3cffaab4f" UNIQUE ("UserID"), CONSTRAINT "PK_454aa355f9b9ff32a15fc74c8e6" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "UserAccountSettings" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "RegistrationIDHash" character varying NOT NULL, "ResetForgottenPasswordIDHash" character varying, "ResetForgottenPasswordExpiration" TIMESTAMP WITH TIME ZONE, "AccountProvider" integer NOT NULL, "InviterEmail" character varying, "AccountStatus" integer NOT NULL, "Role" integer NOT NULL, "EntityCategory" integer NOT NULL, "ProfileVisibility" integer NOT NULL, "EmailVisibility" integer NOT NULL, "BirthDateVisibility" integer NOT NULL, "PhoneNumberVisibility" integer NOT NULL, "Locale" character varying NOT NULL, "UserID" uuid, CONSTRAINT "REL_5a7eb571f0bc1e9de185a6b63d" UNIQUE ("UserID"), CONSTRAINT "PK_9272ecdde0da589d97ea1d2e95d" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "ProjectImage" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Key" character varying NOT NULL, "Location" character varying NOT NULL, "ThumbnailLocation" character varying NOT NULL, "Size" numeric NOT NULL, CONSTRAINT "PK_03444fde5df9645896a00e848a6" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "Tag" ("ID" character varying(20) NOT NULL, "Name" character varying(100) NOT NULL, "Color" character varying(20) NOT NULL, "BackgroundColor" character varying(20) NOT NULL, CONSTRAINT "PK_ca4f325094b6fbbb0c0d8f064a8" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "ProjectNeed" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Description" character varying(500) NOT NULL, "ProjectID" uuid, CONSTRAINT "PK_8952f563a39e0dd9a759bac286c" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "ProjectUpdate" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Description" character varying(500) NOT NULL, "ProjectID" uuid, CONSTRAINT "PK_13e35a1926f2312f03d1310ea54" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "Project" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Name" character varying(100) NOT NULL, "Description" character varying(500), "Email" character varying(100), "PhoneNumber" character varying(50), "Date" TIMESTAMP WITH TIME ZONE NOT NULL, "Budget" numeric, "Currency" character varying NOT NULL, "City" character varying(100) NOT NULL, "IsCompleted" boolean NOT NULL, "SearchTokens" tsvector, "Status" integer NOT NULL, "Visibility" integer NOT NULL, "InitiatorID" uuid, "ImageID" uuid, CONSTRAINT "REL_91b433e693d439d9ce40623f18" UNIQUE ("ImageID"), CONSTRAINT "PK_8d9b9f2cd4400b2861e2fa3f00d" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "User" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Name" character varying NOT NULL, "Email" character varying(100) NOT NULL, "Username" character varying(100) NOT NULL, "PasswordHash" character varying NOT NULL, "Description" character varying, "BirthDate" TIMESTAMP WITH TIME ZONE, "PhoneNumber" character varying, "Website" character varying, "SearchTokens" tsvector, "ProfileImageID" uuid, CONSTRAINT "REL_6b519da47b33fb18d9db02d97e" UNIQUE ("ProfileImageID"), CONSTRAINT "PK_7c38bb872c3c617c80a311b81d0" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2f56f7040c2b05fc8f08a113f7" ON "User"  ("Email") `);
        await queryRunner.query(`CREATE TABLE "Award" ("DateCreated" TIMESTAMP NOT NULL DEFAULT now(), "DateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "Version" integer NOT NULL, "ID" uuid NOT NULL DEFAULT uuid_generate_v4(), "Title" character varying(100) NOT NULL, "Issuer" character varying(100) NOT NULL, "Description" character varying NOT NULL, "Date" TIMESTAMP WITH TIME ZONE NOT NULL, "UserID" uuid, CONSTRAINT "PK_a6d1e5342f5d7b7633c7b50286a" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "Currency" ("ID" character varying(10) NOT NULL, "Name" character varying(100) NOT NULL, CONSTRAINT "PK_eefb5d87e298802d8c17beccf94" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "EntityCategory" ("ID" integer NOT NULL, "Name" character varying(100) NOT NULL, "ParentID" integer, CONSTRAINT "PK_029cde6c720b2d2a0c8a8383f22" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "FileCategory" ("ID" integer NOT NULL, "Name" character varying(100) NOT NULL, CONSTRAINT "PK_907c2a3a04bad851a27f6678f0c" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "Locale" ("ID" character varying(20) NOT NULL, "Name" character varying(100) NOT NULL, CONSTRAINT "PK_0150618d9beeaaf5c3174449330" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "ProjectStatus" ("ID" integer NOT NULL, "Name" character varying(100) NOT NULL, CONSTRAINT "PK_a6e01c7a8c2dd00c241bea328a7" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "UserAccountProvider" ("ID" integer NOT NULL, "Name" character varying(100) NOT NULL, CONSTRAINT "PK_43e9fba091dc9110517dc37e5d9" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "UserAccountStatus" ("ID" integer NOT NULL, "Name" character varying(100) NOT NULL, CONSTRAINT "PK_00e661e287613a84e9146e1791f" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "UserRole" ("ID" integer NOT NULL, "Name" character varying(100) NOT NULL, CONSTRAINT "PK_446ad4edcf7f1eb13f071de48ed" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "Visibility" ("ID" integer NOT NULL, "Name" character varying(100) NOT NULL, CONSTRAINT "PK_db05b52391276c3e8ee31926c74" PRIMARY KEY ("ID"))`);
        await queryRunner.query(`CREATE TABLE "ProfessionalSkill" ("professionalID" uuid NOT NULL, "skillID" integer NOT NULL, CONSTRAINT "PK_d32c42ff1bad40e713022b09640" PRIMARY KEY ("professionalID", "skillID"))`);
        await queryRunner.query(`CREATE TABLE "ProjectNeedTag" ("projectNeedID" uuid NOT NULL, "tagID" character varying(20) NOT NULL, CONSTRAINT "PK_ddde78197cc5fb0be4bd5540d8e" PRIMARY KEY ("projectNeedID", "tagID"))`);
        await queryRunner.query(`ALTER TABLE "UserFile" ADD CONSTRAINT "FK_2ca744fdf20071e853aeb85e7d1" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "UserImage" ADD CONSTRAINT "FK_edc0110eaef909032a741341b89" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "UserVideo" ADD CONSTRAINT "FK_e2a8bd0e042103d887e4bfe4b23" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "UserSocialMedia" ADD CONSTRAINT "FK_b5d64292bf3efd4fdcead95ec1d" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "UserSocialMedia" ADD CONSTRAINT "FK_50990c834d8961856f6cca1534e" FOREIGN KEY ("SocialMediaCategoryID") REFERENCES "SocialMediaCategory"("ID")`);
        await queryRunner.query(`ALTER TABLE "Experience" ADD CONSTRAINT "FK_e3d40ffc01c63db1d48ea29de0f" FOREIGN KEY ("ProfessionalID") REFERENCES "Professional"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Education" ADD CONSTRAINT "FK_e3909b4a9dd7bd54409cab03980" FOREIGN KEY ("ProfessionalID") REFERENCES "Professional"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Professional" ADD CONSTRAINT "FK_8ed7e58c98b95d0ae3cffaab4ff" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "UserAccountSettings" ADD CONSTRAINT "FK_5a7eb571f0bc1e9de185a6b63df" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ProjectNeed" ADD CONSTRAINT "FK_064cc6a0d594b4ce4fb9e3d12f6" FOREIGN KEY ("ProjectID") REFERENCES "Project"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ProjectUpdate" ADD CONSTRAINT "FK_21c6a4d8a159111832d4847bb21" FOREIGN KEY ("ProjectID") REFERENCES "Project"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Project" ADD CONSTRAINT "FK_a04b712fcb031615174cdf8ab35" FOREIGN KEY ("InitiatorID") REFERENCES "User"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Project" ADD CONSTRAINT "FK_91b433e693d439d9ce40623f187" FOREIGN KEY ("ImageID") REFERENCES "ProjectImage"("ID")`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_6b519da47b33fb18d9db02d97e1" FOREIGN KEY ("ProfileImageID") REFERENCES "UserImage"("ID")`);
        await queryRunner.query(`ALTER TABLE "Award" ADD CONSTRAINT "FK_6b7da3cd0a55b599e7467d6f151" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "EntityCategory" ADD CONSTRAINT "FK_99e5a7e8a2d8d92733ff7b77016" FOREIGN KEY ("ParentID") REFERENCES "EntityCategory"("ID")`);
        await queryRunner.query(`ALTER TABLE "ProfessionalSkill" ADD CONSTRAINT "FK_0e7b79edba3acd679e5353716db" FOREIGN KEY ("professionalID") REFERENCES "Professional"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ProfessionalSkill" ADD CONSTRAINT "FK_d21c16ea75b6ceb63da68befe18" FOREIGN KEY ("skillID") REFERENCES "Skill"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ProjectNeedTag" ADD CONSTRAINT "FK_77de0a22e840deea3fe51555d47" FOREIGN KEY ("projectNeedID") REFERENCES "ProjectNeed"("ID") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ProjectNeedTag" ADD CONSTRAINT "FK_757e088e403005ec047832b0266" FOREIGN KEY ("tagID") REFERENCES "Tag"("ID") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "ProjectNeedTag" DROP CONSTRAINT "FK_757e088e403005ec047832b0266"`);
        await queryRunner.query(`ALTER TABLE "ProjectNeedTag" DROP CONSTRAINT "FK_77de0a22e840deea3fe51555d47"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalSkill" DROP CONSTRAINT "FK_d21c16ea75b6ceb63da68befe18"`);
        await queryRunner.query(`ALTER TABLE "ProfessionalSkill" DROP CONSTRAINT "FK_0e7b79edba3acd679e5353716db"`);
        await queryRunner.query(`ALTER TABLE "EntityCategory" DROP CONSTRAINT "FK_99e5a7e8a2d8d92733ff7b77016"`);
        await queryRunner.query(`ALTER TABLE "Award" DROP CONSTRAINT "FK_6b7da3cd0a55b599e7467d6f151"`);
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_6b519da47b33fb18d9db02d97e1"`);
        await queryRunner.query(`ALTER TABLE "Project" DROP CONSTRAINT "FK_91b433e693d439d9ce40623f187"`);
        await queryRunner.query(`ALTER TABLE "Project" DROP CONSTRAINT "FK_a04b712fcb031615174cdf8ab35"`);
        await queryRunner.query(`ALTER TABLE "ProjectUpdate" DROP CONSTRAINT "FK_21c6a4d8a159111832d4847bb21"`);
        await queryRunner.query(`ALTER TABLE "ProjectNeed" DROP CONSTRAINT "FK_064cc6a0d594b4ce4fb9e3d12f6"`);
        await queryRunner.query(`ALTER TABLE "UserAccountSettings" DROP CONSTRAINT "FK_5a7eb571f0bc1e9de185a6b63df"`);
        await queryRunner.query(`ALTER TABLE "Professional" DROP CONSTRAINT "FK_8ed7e58c98b95d0ae3cffaab4ff"`);
        await queryRunner.query(`ALTER TABLE "Education" DROP CONSTRAINT "FK_e3909b4a9dd7bd54409cab03980"`);
        await queryRunner.query(`ALTER TABLE "Experience" DROP CONSTRAINT "FK_e3d40ffc01c63db1d48ea29de0f"`);
        await queryRunner.query(`ALTER TABLE "UserSocialMedia" DROP CONSTRAINT "FK_50990c834d8961856f6cca1534e"`);
        await queryRunner.query(`ALTER TABLE "UserSocialMedia" DROP CONSTRAINT "FK_b5d64292bf3efd4fdcead95ec1d"`);
        await queryRunner.query(`ALTER TABLE "UserVideo" DROP CONSTRAINT "FK_e2a8bd0e042103d887e4bfe4b23"`);
        await queryRunner.query(`ALTER TABLE "UserImage" DROP CONSTRAINT "FK_edc0110eaef909032a741341b89"`);
        await queryRunner.query(`ALTER TABLE "UserFile" DROP CONSTRAINT "FK_2ca744fdf20071e853aeb85e7d1"`);
        await queryRunner.query(`DROP TABLE "ProjectNeedTag"`);
        await queryRunner.query(`DROP TABLE "ProfessionalSkill"`);
        await queryRunner.query(`DROP TABLE "Visibility"`);
        await queryRunner.query(`DROP TABLE "UserRole"`);
        await queryRunner.query(`DROP TABLE "UserAccountStatus"`);
        await queryRunner.query(`DROP TABLE "UserAccountProvider"`);
        await queryRunner.query(`DROP TABLE "ProjectStatus"`);
        await queryRunner.query(`DROP TABLE "Locale"`);
        await queryRunner.query(`DROP TABLE "FileCategory"`);
        await queryRunner.query(`DROP TABLE "EntityCategory"`);
        await queryRunner.query(`DROP TABLE "Currency"`);
        await queryRunner.query(`DROP TABLE "Award"`);
        await queryRunner.query(`DROP INDEX "IDX_2f56f7040c2b05fc8f08a113f7"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "Project"`);
        await queryRunner.query(`DROP TABLE "ProjectUpdate"`);
        await queryRunner.query(`DROP TABLE "ProjectNeed"`);
        await queryRunner.query(`DROP TABLE "Tag"`);
        await queryRunner.query(`DROP TABLE "ProjectImage"`);
        await queryRunner.query(`DROP TABLE "UserAccountSettings"`);
        await queryRunner.query(`DROP TABLE "Professional"`);
        await queryRunner.query(`DROP TABLE "Skill"`);
        await queryRunner.query(`DROP TABLE "Education"`);
        await queryRunner.query(`DROP TABLE "Experience"`);
        await queryRunner.query(`DROP TABLE "UserSocialMedia"`);
        await queryRunner.query(`DROP TABLE "SocialMediaCategory"`);
        await queryRunner.query(`DROP TABLE "UserVideo"`);
        await queryRunner.query(`DROP TABLE "UserImage"`);
        await queryRunner.query(`DROP TABLE "UserFile"`);
    }

}
