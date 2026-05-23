CREATE TABLE IF NOT EXISTS `admin` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `email` TEXT NOT NULL UNIQUE,
  `password_hash` TEXT NOT NULL,
  `created_at` TEXT NOT NULL DEFAULT (datetime('now')),
  `updated_at` TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS `guest` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `name` TEXT NOT NULL,
  `company_name` TEXT NOT NULL,
  `email` TEXT NOT NULL UNIQUE,
  `password_hash` TEXT NOT NULL,
  `created_at` TEXT NOT NULL DEFAULT (datetime('now')),
  `updated_at` TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS `hackathon` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `name` TEXT NOT NULL,
  `scoring_date` TEXT NOT NULL,
  `access_password` TEXT NOT NULL,
  `created_at` TEXT NOT NULL DEFAULT (datetime('now')),
  `updated_at` TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS `team` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `name` TEXT NOT NULL,
  `hackathon_id` TEXT NOT NULL REFERENCES `hackathon`(`id`) ON DELETE CASCADE,
  `topaz_link` TEXT,
  `created_at` TEXT NOT NULL DEFAULT (datetime('now')),
  `updated_at` TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS `scoring_item` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `name` TEXT NOT NULL,
  `max_score` INTEGER NOT NULL,
  `hackathon_id` TEXT NOT NULL REFERENCES `hackathon`(`id`) ON DELETE CASCADE,
  `created_at` TEXT NOT NULL DEFAULT (datetime('now')),
  `updated_at` TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS `scoring_result` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `judge_name` TEXT NOT NULL,
  `comment` TEXT NOT NULL DEFAULT '',
  `team_id` TEXT NOT NULL REFERENCES `team`(`id`) ON DELETE CASCADE,
  `created_at` TEXT NOT NULL DEFAULT (datetime('now')),
  `updated_at` TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS `scoring_item_result` (
  `id` TEXT PRIMARY KEY NOT NULL,
  `score` INTEGER NOT NULL,
  `scoring_item_id` TEXT NOT NULL REFERENCES `scoring_item`(`id`) ON DELETE CASCADE,
  `scoring_result_id` TEXT NOT NULL REFERENCES `scoring_result`(`id`) ON DELETE CASCADE,
  `created_at` TEXT NOT NULL DEFAULT (datetime('now')),
  `updated_at` TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS `hackathon_guest` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `hackathon_id` TEXT NOT NULL REFERENCES `hackathon`(`id`) ON DELETE CASCADE,
  `guest_id` TEXT NOT NULL REFERENCES `guest`(`id`) ON DELETE CASCADE,
  `created_at` TEXT NOT NULL DEFAULT (datetime('now')),
  `updated_at` TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(`hackathon_id`, `guest_id`)
);

CREATE TABLE IF NOT EXISTS `presentation_order` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `order` INTEGER NOT NULL,
  `team_id` TEXT NOT NULL REFERENCES `team`(`id`) ON DELETE CASCADE,
  `created_at` TEXT NOT NULL DEFAULT (datetime('now')),
  `updated_at` TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS `confirmed_team_order` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `hackathon_id` TEXT NOT NULL UNIQUE REFERENCES `hackathon`(`id`) ON DELETE CASCADE,
  `created_at` TEXT NOT NULL DEFAULT (datetime('now')),
  `updated_at` TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS `team_social` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `team_id` TEXT NOT NULL REFERENCES `team`(`id`) ON DELETE CASCADE,
  `platform` TEXT NOT NULL,
  `url` TEXT NOT NULL,
  `created_at` TEXT NOT NULL DEFAULT (datetime('now')),
  `updated_at` TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS `idx_team_hackathon` ON `team`(`hackathon_id`);
CREATE INDEX IF NOT EXISTS `idx_scoring_item_hackathon` ON `scoring_item`(`hackathon_id`);
CREATE INDEX IF NOT EXISTS `idx_scoring_result_team` ON `scoring_result`(`team_id`);
CREATE INDEX IF NOT EXISTS `idx_scoring_item_result_scoring_item` ON `scoring_item_result`(`scoring_item_id`);
CREATE INDEX IF NOT EXISTS `idx_scoring_item_result_scoring_result` ON `scoring_item_result`(`scoring_result_id`);
CREATE INDEX IF NOT EXISTS `idx_hackathon_guest_hackathon` ON `hackathon_guest`(`hackathon_id`);
CREATE INDEX IF NOT EXISTS `idx_hackathon_guest_guest` ON `hackathon_guest`(`guest_id`);
CREATE INDEX IF NOT EXISTS `idx_presentation_order_team` ON `presentation_order`(`team_id`);
