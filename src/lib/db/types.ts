import type { InferSelectModel } from "drizzle-orm";
import type {
	admin,
	confirmed_team_order,
	guest,
	hackathon,
	hackathon_guest,
	presentation_order,
	scoring_item,
	scoring_item_result,
	scoring_result,
	team,
	team_social,
} from "./schema";

export type Admin = InferSelectModel<typeof admin>;
export type Guest = InferSelectModel<typeof guest>;
export type SafeGuest = Omit<Guest, "password_hash">;
export type Hackathon = InferSelectModel<typeof hackathon>;
export type Team = InferSelectModel<typeof team>;
export type ScoringItem = InferSelectModel<typeof scoring_item>;
export type ScoringResult = InferSelectModel<typeof scoring_result>;
export type ScoringItemResult = InferSelectModel<typeof scoring_item_result>;
export type HackathonGuest = InferSelectModel<typeof hackathon_guest>;
export type PresentationOrder = InferSelectModel<typeof presentation_order>;
export type ConfirmedTeamOrder = InferSelectModel<typeof confirmed_team_order>;
export type TeamSocial = InferSelectModel<typeof team_social>;
