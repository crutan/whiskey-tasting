CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"admin" boolean DEFAULT false
);
