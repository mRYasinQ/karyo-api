import { Migration } from '@mikro-orm/migrations';

export class Migration20260224205645 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "sessions" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "browser" varchar(60) not null, "os" varchar(60) not null, "token" varchar(80) not null, "user_id" int not null, "expire_at" timestamptz not null);`);
    this.addSql(`create index "sessions_token_index" on "sessions" ("token");`);
    this.addSql(`alter table "sessions" add constraint "sessions_token_unique" unique ("token");`);

    this.addSql(`alter table "sessions" add constraint "sessions_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "sessions" cascade;`);
  }

}
