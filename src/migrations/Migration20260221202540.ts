import { Migration } from '@mikro-orm/migrations';

export class Migration20260221202540 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "users" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(30) null, "last_name" varchar(30) null, "email" varchar(255) not null, "username" varchar(30) not null, "password" text not null, "is_active" boolean not null default true, "birthday" date null);`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
    this.addSql(`alter table "users" add constraint "users_username_unique" unique ("username");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }

}
