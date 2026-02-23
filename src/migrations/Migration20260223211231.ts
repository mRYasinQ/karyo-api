import { Migration } from '@mikro-orm/migrations';

export class Migration20260223211231 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" add column "is_email_verified" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop column "is_email_verified";`);
  }

}
