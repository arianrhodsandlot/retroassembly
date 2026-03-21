CREATE TABLE `favorites` (
	`rom_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_favorites_user_rom` ON `favorites` (`user_id`,`rom_id`);--> statement-breakpoint
CREATE INDEX `idx_favorites_user_status` ON `favorites` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_favorites_user_status_created` ON `favorites` (`user_id`,`status`,`created_at`);