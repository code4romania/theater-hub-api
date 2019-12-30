import {MigrationInterface, QueryRunner} from "typeorm";

export class SetupMigration1576327667464 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE OR REPLACE FUNCTION update_user_search_tokens()
                RETURNS TRIGGER AS $tr_update_user_search_tokens$
            BEGIN
                IF (TG_OP = 'INSERT' OR OLD."Name" <> NEW."Name" OR (OLD."Description" IS NULL AND NEW."Description" IS NOT NULL) OR OLD."Description" <> NEW."Description") THEN
                    UPDATE "User" u
                    SET "SearchTokens" = to_tsvector(
                        (
                            select l."Name"
                            from "UserAccountSettings" uas
                            join "Locale" l on l."ID" = uas."Locale"
                            where uas."UserID" = u."ID"
                        )::regconfig,
                        coalesce("Name", '') || ' ' || coalesce("Description", '')
                    )
                    WHERE "ID" = NEW."ID";
                END IF;

                RETURN NEW;
            END;
            $tr_update_user_search_tokens$ LANGUAGE plpgsql;`
        );

        await queryRunner.query(
            `CREATE TRIGGER tr_update_user_search_tokens
                AFTER INSERT OR UPDATE ON public."User"
                FOR EACH ROW
                EXECUTE PROCEDURE update_user_search_tokens();`
        );

        await queryRunner.query(
            `CREATE OR REPLACE FUNCTION set_project_search_tokens(id UUID)
                RETURNS VOID
                AS $$
                BEGIN
                    UPDATE "Project" p
                    SET "SearchTokens" = to_tsvector(
                        (
                            select l."Name"
                            from "UserAccountSettings" uas
                            join "Locale" l on l."ID" = uas."Locale"
                            where uas."UserID" = p."InitiatorID"
                        )::regconfig,
                        coalesce("Name", '') || ' ' || coalesce("Description", '') ||
                        (
                            select string_agg(coalesce(pn."Description"), ' ')
                            from public."ProjectNeed" pn
                            where pn."ProjectID" = p."ID"
                            AND (pn."Description" = '') IS FALSE
                        )
                    )
                    WHERE "ID" = id;
                END;
                $$
                LANGUAGE plpgsql;`
        );

        await queryRunner.query(
            `CREATE OR REPLACE FUNCTION update_project_search_tokens()
                RETURNS TRIGGER AS $tr_update_project_search_tokens$
            BEGIN
                IF (TG_OP = 'INSERT' OR OLD."Name" <> NEW."Name" OR (OLD."Description" IS NULL AND NEW."Description" IS NOT NULL) OR OLD."Description" <> NEW."Description") THEN
                    PERFORM set_project_search_tokens(NEW."ID");
                END IF;

                RETURN NEW;
            END;
            $tr_update_project_search_tokens$ LANGUAGE plpgsql;`
        );

        await queryRunner.query(
            `CREATE TRIGGER tr_update_project_search_tokens
                AFTER INSERT OR UPDATE ON public."Project"
                FOR EACH ROW
                EXECUTE PROCEDURE update_project_search_tokens();`
        );

        await queryRunner.query(
            `CREATE OR REPLACE FUNCTION update_project_need_search_tokens()
                RETURNS TRIGGER AS $tr_update_project_need_search_tokens$
            BEGIN
                IF (TG_OP = 'INSERT' OR OLD."Description" <> NEW."Description") THEN
                    PERFORM set_project_search_tokens(NEW."ProjectID");
                END IF;

                RETURN NEW;
            END;
            $tr_update_project_need_search_tokens$ LANGUAGE plpgsql;`
        );

        await queryRunner.query(
            `CREATE TRIGGER tr_update_project_need_search_tokens
                AFTER INSERT OR UPDATE ON public."ProjectNeed"
                FOR EACH ROW
                EXECUTE PROCEDURE update_project_need_search_tokens();`
        );

        await queryRunner.query(
            `CREATE OR REPLACE FUNCTION elevate_to_super_admin(email varchar)
                RETURNS void AS $$
            BEGIN
				UPDATE public."UserAccountSettings" uas SET "Role" = 2
				FROM public."User" u
				WHERE uas."UserID" = u."ID" AND u."Email" = email;
            END;
            $$ LANGUAGE plpgsql;`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
