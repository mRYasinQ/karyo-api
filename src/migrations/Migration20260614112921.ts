import { Migration } from '@mikro-orm/migrations';

export class Migration20260614112921 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "tasks" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(150) not null, "description" text null, "due_date" timestamptz null, "status" text check ("status" in ('todo', 'in_progress', 'review', 'done')) not null default 'todo', "project_id" int not null, "assignee_id" int null);`);
    this.addSql(`create index "tasks_title_index" on "tasks" ("title");`);

    this.addSql(`alter table "tasks" add constraint "tasks_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "tasks" add constraint "tasks_assignee_id_foreign" foreign key ("assignee_id") references "users" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "tasks" cascade;`);
  }

}
