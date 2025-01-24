import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1737721242872 implements MigrationInterface {
  name = 'Migrations1737721242872';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "version" integer NOT NULL, "text" character varying NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_users_user" ("notificationId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_7606b7d7b70299cea4521b61989" PRIMARY KEY ("notificationId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cc471803e22568445b772a45ea" ON "notification_users_user" ("notificationId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9c0c1c8c13cf53180e087e7f36" ON "notification_users_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "visitorId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_users_user" ADD CONSTRAINT "FK_cc471803e22568445b772a45ea0" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_users_user" ADD CONSTRAINT "FK_9c0c1c8c13cf53180e087e7f364" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification_users_user" DROP CONSTRAINT "FK_9c0c1c8c13cf53180e087e7f364"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_users_user" DROP CONSTRAINT "FK_cc471803e22568445b772a45ea0"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "visitorId"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9c0c1c8c13cf53180e087e7f36"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cc471803e22568445b772a45ea"`,
    );
    await queryRunner.query(`DROP TABLE "notification_users_user"`);
    await queryRunner.query(`DROP TABLE "notification"`);
  }
}
