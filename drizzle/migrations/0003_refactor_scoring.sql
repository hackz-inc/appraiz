DROP TABLE IF EXISTS scoring_item_result;
DROP TABLE IF EXISTS scoring_result;

CREATE TABLE scoring_result (
  id TEXT PRIMARY KEY NOT NULL,
  judge_name TEXT NOT NULL,
  comment TEXT NOT NULL DEFAULT '',
  user_agent TEXT,
  hackathon_id TEXT NOT NULL REFERENCES hackathon(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE scoring_item_result (
  id TEXT PRIMARY KEY NOT NULL,
  score INTEGER NOT NULL,
  scoring_item_id TEXT NOT NULL REFERENCES scoring_item(id) ON DELETE CASCADE,
  scoring_result_id TEXT NOT NULL REFERENCES scoring_result(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL REFERENCES team(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
