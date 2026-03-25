DROP INDEX `idx_favorites_user_status`;--> statement-breakpoint
CREATE INDEX `idx_favorites_user_rom_status` ON `favorites` (`user_id`,`rom_id`,`status`);--> statement-breakpoint
DROP INDEX `idx_sessions_token`;--> statement-breakpoint
DROP INDEX `idx_sessions_expires`;--> statement-breakpoint
DROP INDEX `idx_sessions_activity`;--> statement-breakpoint
DROP INDEX `idx_users_status`;--> statement-breakpoint
CREATE INDEX `idx_roms_file_status` ON `roms` (`file_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_roms_user_platform_filename` ON `roms` (`user_id`,`platform`,`file_name`);--> statement-breakpoint
CREATE INDEX `idx_states_user_rom_status_type` ON `states` (`user_id`,`rom_id`,`status`,`type`);