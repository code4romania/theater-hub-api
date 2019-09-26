import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedMigration1569431299920 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (0, 'Professional', null)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (1, 'Institution', null)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (2, 'Sponsor', null)`);

        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (0, 'comedy')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (1, 'drama')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (2, 'acting')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (3, 'stand-up')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (4, 'dancing')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (5, 'directing')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (6, 'lighting')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (7, 'playwright')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (8, 'sufleor')`);

        await queryRunner.query(`INSERT INTO "SocialMediaCategory"("ID", "Name") VALUES (0, 'Instagram')`);
        await queryRunner.query(`INSERT INTO "SocialMediaCategory"("ID", "Name") VALUES (1, 'Youtube')`);
        await queryRunner.query(`INSERT INTO "SocialMediaCategory"("ID", "Name") VALUES (2, 'Facebook')`);
        await queryRunner.query(`INSERT INTO "SocialMediaCategory"("ID", "Name") VALUES (3, 'LinkedIn')`);
        await queryRunner.query(`INSERT INTO "SocialMediaCategory"("ID", "Name") VALUES (4, 'Vimeo')`);

        await queryRunner.query(`INSERT INTO "UserAccountStatus"("ID", "Name") VALUES (0, 'Managed')`);
        await queryRunner.query(`INSERT INTO "UserAccountStatus"("ID", "Name") VALUES (1, 'Registered')`);
        await queryRunner.query(`INSERT INTO "UserAccountStatus"("ID", "Name") VALUES (2, 'Confirmed')`);
        await queryRunner.query(`INSERT INTO "UserAccountStatus"("ID", "Name") VALUES (3, 'Enabled')`);
        await queryRunner.query(`INSERT INTO "UserAccountStatus"("ID", "Name") VALUES (4, 'Disabled')`);
        await queryRunner.query(`INSERT INTO "UserAccountStatus"("ID", "Name") VALUES (5, 'Deleted')`);

        await queryRunner.query(`INSERT INTO "UserRole"("ID", "Name") VALUES (0, 'User')`);
        await queryRunner.query(`INSERT INTO "UserRole"("ID", "Name") VALUES (1, 'Admin')`);
        await queryRunner.query(`INSERT INTO "UserRole"("ID", "Name") VALUES (2, 'SuperAdmin')`);

        await queryRunner.query(`INSERT INTO "ProjectStatus"("ID", "Name") VALUES (0, 'Enabled')`);
        await queryRunner.query(`INSERT INTO "ProjectStatus"("ID", "Name") VALUES (1, 'Disabled')`);
        await queryRunner.query(`INSERT INTO "ProjectStatus"("ID", "Name") VALUES (2, 'Deleted')`);

        await queryRunner.query(`INSERT INTO "Visibility"("ID", "Name") VALUES (0, 'Everyone')`);
        await queryRunner.query(`INSERT INTO "Visibility"("ID", "Name") VALUES (1, 'Community')`);
        await queryRunner.query(`INSERT INTO "Visibility"("ID", "Name") VALUES (2, 'Private')`);

        await queryRunner.query(`INSERT INTO "Locale"("ID", "Name") VALUES ('ro', 'Romanian')`);
        await queryRunner.query(`INSERT INTO "Locale"("ID", "Name") VALUES ('en', 'English')`);

        await queryRunner.query(`INSERT INTO "FileCategory"("ID", "Name") VALUES (0, 'Misc')`);
        await queryRunner.query(`INSERT INTO "FileCategory"("ID", "Name") VALUES (1, 'Resume')`);

        await queryRunner.query(`INSERT INTO "Currency"("ID", "Name") VALUES ('RON', 'Romania Leu')`);
        await queryRunner.query(`INSERT INTO "Currency"("ID", "Name") VALUES ('USD', 'US Dollar')`);
        await queryRunner.query(`INSERT INTO "Currency"("ID", "Name") VALUES ('EUR', 'Euro')`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
