import { Migration } from '@mikro-orm/migrations';

export class Migration20260227210437 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "roles" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(150) not null, "permissions" text[] not null);`);
    this.addSql(`alter table "roles" add constraint "roles_name_unique" unique ("name");`);

    this.addSql(`alter table "users" add column "role_id" int null;`);
    this.addSql(`alter table "users" add constraint "users_role_id_foreign" foreign key ("role_id") references "roles" ("id") on update cascade on delete set null;`);
    this.addSql(`create index "users_role_id_index" on "users" ("role_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop constraint "users_role_id_foreign";`);

    this.addSql(`drop table if exists "roles" cascade;`);

    this.addSql(`drop index "users_role_id_index";`);
    this.addSql(`alter table "users" drop column "role_id";`);
  }

}
