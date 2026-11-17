ALTER TABLE `quote_enquiries` ADD `notification_status` text DEFAULT 'not_requested' NOT NULL;--> statement-breakpoint
ALTER TABLE `quote_enquiries` ADD `notification_attempted_at` text;--> statement-breakpoint
ALTER TABLE `quote_enquiries` ADD `notification_accepted_at` text;--> statement-breakpoint
ALTER TABLE `quote_enquiries` ADD `notification_error` text;