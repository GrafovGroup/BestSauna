CREATE TABLE `quote_enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`idempotency_key` text NOT NULL,
	`payload_hash` text NOT NULL,
	`created_at` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`location` text NOT NULL,
	`intended_use` text NOT NULL,
	`placement` text NOT NULL,
	`interest` text NOT NULL,
	`service` text NOT NULL,
	`timeframe` text NOT NULL,
	`contact_method` text DEFAULT 'email' NOT NULL,
	`capacity` text DEFAULT '' NOT NULL,
	`heat` text DEFAULT '' NOT NULL,
	`budget` text DEFAULT '' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`commercial_details` text DEFAULT '' NOT NULL,
	`language` text NOT NULL,
	`source_path` text NOT NULL,
	`privacy_accepted` integer NOT NULL,
	`privacy_version` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quote_enquiries_reference_unique` ON `quote_enquiries` (`reference`);--> statement-breakpoint
CREATE UNIQUE INDEX `quote_enquiries_idempotency_key_unique` ON `quote_enquiries` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `quote_enquiries_created_at_idx` ON `quote_enquiries` (`created_at`);--> statement-breakpoint
CREATE TABLE `quote_rate_limits` (
	`bucket_key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `quote_rate_limits_expires_at_idx` ON `quote_rate_limits` (`expires_at`);