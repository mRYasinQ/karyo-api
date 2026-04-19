import { Migration } from '@mikro-orm/migrations';

export class Migration20260419212253 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "workspace_member_entity" drop constraint "workspace_member_entity_workspace_id_foreign";`);

    this.addSql(`create table "workspaces" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(50) not null, "slug" varchar(255) not null, "logo" varchar(255) null, "description" varchar(200) null);`);
    this.addSql(`alter table "workspaces" add constraint "workspaces_slug_unique" unique ("slug");`);

    this.addSql(`create table "workspace_members" ("workspace_id" int not null, "user_id" int not null, "is_active" boolean not null default false, "role" text check ("role" in ('owner', 'admin', 'member', 'guest')) not null default 'member', "joined_at" timestamptz not null, constraint "workspace_members_pkey" primary key ("workspace_id", "user_id"));`);
    this.addSql(`alter table "workspace_members" add constraint "workspace_members_user_id_workspace_id_unique" unique ("user_id", "workspace_id");`);

    this.addSql(`alter table "workspace_members" add constraint "workspace_members_workspace_id_foreign" foreign key ("workspace_id") references "workspaces" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "workspace_members" add constraint "workspace_members_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "workspace_entity" cascade;`);

    this.addSql(`drop table if exists "workspace_member_entity" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "workspace_members" drop constraint "workspace_members_workspace_id_foreign";`);

    this.addSql(`create table "workspace_entity" ("id" serial primary key, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "name" varchar(50) not null, "slug" varchar(255) not null, "logo" varchar(255) null, "description" varchar(200) null);`);
    this.addSql(`alter table "workspace_entity" add constraint "workspace_entity_slug_unique" unique ("slug");`);

    this.addSql(`create table "workspace_member_entity" ("workspace_id" int4 not null, "user_id" int4 not null, "role" text check ("role" in ('owner', 'admin', 'member', 'guest')) not null, "joined_at" timestamptz(6) not null, constraint "workspace_member_entity_pkey" primary key ("workspace_id", "user_id"));`);
    this.addSql(`alter table "workspace_member_entity" add constraint "workspace_member_entity_user_id_workspace_id_unique" unique ("user_id", "workspace_id");`);

    this.addSql(`alter table "workspace_member_entity" add constraint "workspace_member_entity_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "workspace_member_entity" add constraint "workspace_member_entity_workspace_id_foreign" foreign key ("workspace_id") references "workspace_entity" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "workspaces" cascade;`);

    this.addSql(`drop table if exists "workspace_members" cascade;`);
  }

}
