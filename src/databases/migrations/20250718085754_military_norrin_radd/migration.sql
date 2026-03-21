CREATE TABLE `launch_records` (
	`core` text NOT NULL,
	`platform` text NOT NULL,
	`rom_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_launch_records` ON `launch_records` (`user_id`,`status`,`platform`,`rom_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `roms` (
	`file_name` text NOT NULL,
	`game_boxart_file_ids` text,
	`game_description` text,
	`game_developer` text,
	`game_genres` text,
	`game_name` text,
	`game_players` integer,
	`game_publisher` text,
	`game_rating` integer,
	`game_release_date` integer,
	`game_release_year` integer,
	`game_thumbnail_file_ids` text,
	`launchbox_game_id` integer,
	`libretro_game_id` text,
	`platform` text NOT NULL,
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL,
	`file_id` text NOT NULL,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_roms` ON `roms` (`user_id`,`status`,`platform`,`file_name`);--> statement-breakpoint
CREATE INDEX `idx_roms_user_id` ON `roms` (`user_id`,`status`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`expires_at` integer NOT NULL,
	`ip` text,
	`last_activity_at` integer NOT NULL,
	`token` text NOT NULL,
	`user_agent` text,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX `idx_sessions_token` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX `idx_sessions_user` ON `sessions` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_sessions_expires` ON `sessions` (`expires_at`);--> statement-breakpoint
CREATE INDEX `idx_sessions_activity` ON `sessions` (`last_activity_at`);--> statement-breakpoint
CREATE TABLE `states` (
	`core` text NOT NULL,
	`platform` text NOT NULL,
	`rom_id` text NOT NULL,
	`thumbnail_file_id` text NOT NULL,
	`type` text NOT NULL,
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL,
	`file_id` text NOT NULL,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_states` ON `states` (`user_id`,`status`,`rom_id`,`platform`);--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`emulator` text,
	`input` text,
	`ui` text,
	`user` text,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_user_preferences` ON `user_preferences` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`password_hash` text NOT NULL,
	`registration_ip` text,
	`registration_user_agent` text,
	`username` text NOT NULL,
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `idx_users_username` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `idx_users_status` ON `users` (`status`);