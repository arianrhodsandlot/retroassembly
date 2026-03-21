DROP INDEX `idx_launch_records`;--> statement-breakpoint
CREATE INDEX `idx_launch_records_user_status_platform` ON `launch_records` (`user_id`,`status`,`platform`,`created_at`);--> statement-breakpoint
DROP INDEX `idx_roms`;--> statement-breakpoint
DROP INDEX `idx_roms_user_id`;--> statement-breakpoint
CREATE INDEX `idx_roms_user_status_platform` ON `roms` (`user_id`,`status`,`platform`);--> statement-breakpoint
CREATE INDEX `idx_roms_user_status_created` ON `roms` (`user_id`,`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_roms_user_status_released` ON `roms` (`user_id`,`status`,`game_release_date`);--> statement-breakpoint
CREATE INDEX `idx_roms_user_status_name` ON `roms` (`user_id`,`status`,`file_name`);--> statement-breakpoint
DROP INDEX `idx_states`;--> statement-breakpoint
CREATE INDEX `idx_states_rom_status` ON `states` (`rom_id`,`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_states_user_status` ON `states` (`user_id`,`status`);