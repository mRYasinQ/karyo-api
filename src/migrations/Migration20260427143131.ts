import { Migration } from '@mikro-orm/migrations';

export class Migration20260427143131 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "projects" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(50) not null, "slug" varchar(150) not null, "description" varchar(200) null, "is_archived" boolean not null default false, "start_date" timestamptz null, "end_date" timestamptz null, "workspace_id" int not null);`);
    this.addSql(`alter table "projects" add constraint "projects_slug_workspace_id_unique" unique ("slug", "workspace_id");`);

    this.addSql(`alter table "projects" add constraint "projects_workspace_id_foreign" foreign key ("workspace_id") references "workspaces" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "workspaces" alter column "slug" type varchar(150) using ("slug"::varchar(150));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "projects" cascade;`);

    this.addSql(`alter table "workspaces" alter column "slug" type varchar(255) using ("slug"::varchar(255));`);
  }

}
