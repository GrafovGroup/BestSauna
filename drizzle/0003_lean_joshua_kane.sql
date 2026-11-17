CREATE TABLE `measurement_daily` (
	`day` text NOT NULL,
	`event` text NOT NULL,
	`entry_path` text NOT NULL,
	`language` text NOT NULL,
	`device` text NOT NULL,
	`detail` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `measurement_daily_dimensions_idx` ON `measurement_daily` (`day`,`event`,`entry_path`,`language`,`device`,`detail`);--> statement-breakpoint
CREATE TABLE `measurement_receipts` (
	`token` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`event` text NOT NULL,
	`entry_path` text NOT NULL,
	`language` text NOT NULL,
	`device` text NOT NULL,
	`detail` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `measurement_receipts_expires_idx` ON `measurement_receipts` (`expires_at`);
--> statement-breakpoint
-- Keep receipt deduplication and its aggregate increment in one SQLite transaction.
CREATE TRIGGER measurement_receipt_count AFTER INSERT ON measurement_receipts
BEGIN
  INSERT INTO measurement_daily (day, event, entry_path, language, device, detail, count)
  VALUES (NEW.day, NEW.event, NEW.entry_path, NEW.language, NEW.device, NEW.detail, 1)
  ON CONFLICT(day, event, entry_path, language, device, detail) DO UPDATE SET count = count + 1;
END;
