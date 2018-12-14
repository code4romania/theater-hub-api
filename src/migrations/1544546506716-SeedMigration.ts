import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedMigration1544546506716 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (0, 'Professional', null)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (1, 'Institution', null)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (2, 'Sponsor', null)`);

        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (0, 'Comedy')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (1, 'Drama')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (2, 'Acting')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (3, 'Stand-up')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (4, 'Dancing')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (5, 'Directing')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (6, 'Lighting')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (7, 'Playwright')`);
        await queryRunner.query(`INSERT INTO "Skill"("ID", "Name") VALUES (8, 'Sufleor')`);

        await queryRunner.query(`INSERT INTO "SocialMediaCategory"("ID", "Name") VALUES (0, 'Instagram')`);
        await queryRunner.query(`INSERT INTO "SocialMediaCategory"("ID", "Name") VALUES (1, 'Youtube')`);
        await queryRunner.query(`INSERT INTO "SocialMediaCategory"("ID", "Name") VALUES (2, 'Facebook')`);
        await queryRunner.query(`INSERT INTO "SocialMediaCategory"("ID", "Name") VALUES (3, 'Linkedin')`);
        await queryRunner.query(`INSERT INTO "SocialMediaCategory"("ID", "Name") VALUES (4, 'Vimeo')`);

        await queryRunner.query(`INSERT INTO "UserAccountStatus"("ID", "Name") VALUES (0, 'Registered')`);
        await queryRunner.query(`INSERT INTO "UserAccountStatus"("ID", "Name") VALUES (1, 'Confirmed')`);
        await queryRunner.query(`INSERT INTO "UserAccountStatus"("ID", "Name") VALUES (2, 'Enabled')`);
        await queryRunner.query(`INSERT INTO "UserAccountStatus"("ID", "Name") VALUES (3, 'Disabled')`);
        await queryRunner.query(`INSERT INTO "UserAccountStatus"("ID", "Name") VALUES (4, 'Deleted')`);

        await queryRunner.query(`INSERT INTO "UserRole"("ID", "Name") VALUES (0, 'User')`);
        await queryRunner.query(`INSERT INTO "UserRole"("ID", "Name") VALUES (1, 'Admin')`);
        await queryRunner.query(`INSERT INTO "UserRole"("ID", "Name") VALUES (2, 'SuperAdmin')`);

        await queryRunner.query(`INSERT INTO "Visibility"("ID", "Name") VALUES (0, 'Everyone')`);
        await queryRunner.query(`INSERT INTO "Visibility"("ID", "Name") VALUES (1, 'Community')`);
        await queryRunner.query(`INSERT INTO "Visibility"("ID", "Name") VALUES (2, 'Private')`);

        await queryRunner.query(`INSERT INTO "WishCategory"("ID", "Name") VALUES (0, 'Venue')`);
        await queryRunner.query(`INSERT INTO "WishCategory"("ID", "Name") VALUES (1, 'Transport')`);
        await queryRunner.query(`INSERT INTO "WishCategory"("ID", "Name") VALUES (2, 'Props')`);
        await queryRunner.query(`INSERT INTO "WishCategory"("ID", "Name") VALUES (3, 'Marketing')`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
