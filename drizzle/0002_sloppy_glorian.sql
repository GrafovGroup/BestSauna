CREATE TABLE `enquiry_events` (
	`id` text PRIMARY KEY NOT NULL,
	`enquiry_id` text NOT NULL,
	`revision` integer NOT NULL,
	`recorded_at` text NOT NULL,
	`operator` text NOT NULL,
	`changes` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`enquiry_id`) REFERENCES `quote_enquiries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `enquiry_events_revision_idx` ON `enquiry_events` (`enquiry_id`,`revision`);--> statement-breakpoint
CREATE TABLE `enquiry_workflow` (
	`enquiry_id` text PRIMARY KEY NOT NULL,
	`assigned_to` text DEFAULT '' NOT NULL,
	`follow_up_at` text,
	`updated_at` text NOT NULL,
	`revision` integer NOT NULL,
	FOREIGN KEY (`enquiry_id`) REFERENCES `quote_enquiries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `enquiry_workflow_follow_up_idx` ON `enquiry_workflow` (`follow_up_at`);