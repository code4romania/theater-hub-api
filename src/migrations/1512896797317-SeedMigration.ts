import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedMigration1512896797317 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (0, 'Profesionisti', null)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (1, 'Actori', 0)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (2, 'Independenti', 1)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (3, 'Stand Up', 1)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (4, 'Improvizatie', 1)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (5, 'Experimental', 1)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (6, 'Trupa', 1)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (7, 'Tehnicieni', 0)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (8, 'Sunetisti', 7)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (9, 'Luministi', 7)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (10, 'Masinisti', 7)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (11, 'Regizori', 0)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (12, 'Scenaristi', 0)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (13, 'Dansatori', 0)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (14, 'Costumieri', 0)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (15, 'Constructori', 0)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (16, 'Proiectanti', 0)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (17, 'Teatre', null)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (18, 'De stat', 17)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (19, 'Independente', 17)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (20, 'Cluburi', 17)`);
        await queryRunner.query(`INSERT INTO "EntityCategory"("ID", "Name", "ParentID") VALUES (21, 'Sponsor', null)`);

        await queryRunner.query(`INSERT INTO "WishCategory"("ID", "Name") VALUES (0, 'Spatiu')`);
        await queryRunner.query(`INSERT INTO "WishCategory"("ID", "Name") VALUES (1, 'Transport')`);
        await queryRunner.query(`INSERT INTO "WishCategory"("ID", "Name") VALUES (2, 'Recuzita')`);
        await queryRunner.query(`INSERT INTO "WishCategory"("ID", "Name") VALUES (3, 'Marketing')`);

        await queryRunner.query(`INSERT INTO "SocialMediaCategory"("ID", "Name") VALUES (0, 'Instagram')`);
        await queryRunner.query(`INSERT INTO "SocialMediaCategory"("ID", "Name") VALUES (1, 'Youtube')`);
        await queryRunner.query(`INSERT INTO "SocialMediaCategory"("ID", "Name") VALUES (2, 'Facebook')`);
        await queryRunner.query(`INSERT INTO "SocialMediaCategory"("ID", "Name") VALUES (3, 'Linkedin')`);

        await queryRunner.query(`INSERT INTO "UserRole"("ID", "Name") VALUES (0, 'User')`);
        await queryRunner.query(`INSERT INTO "UserRole"("ID", "Name") VALUES (1, 'Admin')`);
        await queryRunner.query(`INSERT INTO "UserRole"("ID", "Name") VALUES (2, 'SuperAdmin')`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
