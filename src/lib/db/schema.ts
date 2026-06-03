import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

const timestamps = {
	created_at: text("created_at")
		.notNull()
		.default(sql`(datetime('now'))`),
	updated_at: text("updated_at")
		.notNull()
		.default(sql`(datetime('now'))`),
};

export const admin = sqliteTable("admin", {
	id: text("id").primaryKey().notNull(),
	email: text("email").notNull().unique(),
	password_hash: text("password_hash").notNull(),
	...timestamps,
});

export const guest = sqliteTable("guest", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	company_name: text("company_name").notNull(),
	email: text("email").notNull().unique(),
	password_hash: text("password_hash").notNull(),
	...timestamps,
});

export const hackathon = sqliteTable("hackathon", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	scoring_date: text("scoring_date").notNull(),
	access_password: text("access_password").notNull(),
	...timestamps,
});

export const team = sqliteTable("team", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	hackathon_id: text("hackathon_id")
		.notNull()
		.references(() => hackathon.id, { onDelete: "cascade" }),
	topaz_link: text("topaz_link"),
	...timestamps,
});

export const scoring_item = sqliteTable("scoring_item", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	max_score: integer("max_score").notNull(),
	hackathon_id: text("hackathon_id")
		.notNull()
		.references(() => hackathon.id, { onDelete: "cascade" }),
	...timestamps,
});

export const scoring_result = sqliteTable("scoring_result", {
	id: text("id").primaryKey().notNull(),
	judge_name: text("judge_name").notNull(),
	comment: text("comment").notNull().default(""),
	user_agent: text("user_agent"),
	hackathon_id: text("hackathon_id")
		.notNull()
		.references(() => hackathon.id, { onDelete: "cascade" }),
	...timestamps,
});

export const scoring_item_result = sqliteTable("scoring_item_result", {
	id: text("id").primaryKey().notNull(),
	score: integer("score").notNull(),
	scoring_item_id: text("scoring_item_id")
		.notNull()
		.references(() => scoring_item.id, { onDelete: "cascade" }),
	scoring_result_id: text("scoring_result_id")
		.notNull()
		.references(() => scoring_result.id, { onDelete: "cascade" }),
	team_id: text("team_id")
		.notNull()
		.references(() => team.id, { onDelete: "cascade" }),
	...timestamps,
});

export const hackathon_guest = sqliteTable(
	"hackathon_guest",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		hackathon_id: text("hackathon_id")
			.notNull()
			.references(() => hackathon.id, { onDelete: "cascade" }),
		guest_id: text("guest_id")
			.notNull()
			.references(() => guest.id, { onDelete: "cascade" }),
		permission: text("permission").notNull().default("view"),
		...timestamps,
	},
	(t) => [unique().on(t.hackathon_id, t.guest_id)],
);

export const presentation_order = sqliteTable("presentation_order", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	order: integer("order").notNull(),
	team_id: text("team_id")
		.notNull()
		.references(() => team.id, { onDelete: "cascade" }),
	...timestamps,
});

export const confirmed_team_order = sqliteTable("confirmed_team_order", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	hackathon_id: text("hackathon_id")
		.notNull()
		.unique()
		.references(() => hackathon.id, { onDelete: "cascade" }),
	...timestamps,
});

export const team_social = sqliteTable("team_social", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	team_id: text("team_id")
		.notNull()
		.references(() => team.id, { onDelete: "cascade" }),
	platform: text("platform").notNull(),
	url: text("url").notNull(),
	...timestamps,
});

// Relations
export const hackathonRelations = relations(hackathon, ({ many }) => ({
	teams: many(team),
	scoring_items: many(scoring_item),
	scoring_results: many(scoring_result),
	hackathon_guests: many(hackathon_guest),
	confirmed_team_orders: many(confirmed_team_order),
}));

export const teamRelations = relations(team, ({ one, many }) => ({
	hackathon: one(hackathon, {
		fields: [team.hackathon_id],
		references: [hackathon.id],
	}),
	presentation_orders: many(presentation_order),
	scoring_item_results: many(scoring_item_result),
	team_socials: many(team_social),
}));

export const scoring_itemRelations = relations(scoring_item, ({ one, many }) => ({
	hackathon: one(hackathon, {
		fields: [scoring_item.hackathon_id],
		references: [hackathon.id],
	}),
	scoring_item_results: many(scoring_item_result),
}));

export const scoring_resultRelations = relations(scoring_result, ({ one, many }) => ({
	hackathon: one(hackathon, {
		fields: [scoring_result.hackathon_id],
		references: [hackathon.id],
	}),
	scoring_item_results: many(scoring_item_result),
}));

export const scoring_item_resultRelations = relations(scoring_item_result, ({ one }) => ({
	scoring_item: one(scoring_item, {
		fields: [scoring_item_result.scoring_item_id],
		references: [scoring_item.id],
	}),
	scoring_result: one(scoring_result, {
		fields: [scoring_item_result.scoring_result_id],
		references: [scoring_result.id],
	}),
	team: one(team, {
		fields: [scoring_item_result.team_id],
		references: [team.id],
	}),
}));

export const hackathon_guestRelations = relations(hackathon_guest, ({ one }) => ({
	hackathon: one(hackathon, {
		fields: [hackathon_guest.hackathon_id],
		references: [hackathon.id],
	}),
	guest: one(guest, {
		fields: [hackathon_guest.guest_id],
		references: [guest.id],
	}),
}));

export const presentation_orderRelations = relations(presentation_order, ({ one }) => ({
	team: one(team, {
		fields: [presentation_order.team_id],
		references: [team.id],
	}),
}));

export const confirmed_team_orderRelations = relations(confirmed_team_order, ({ one }) => ({
	hackathon: one(hackathon, {
		fields: [confirmed_team_order.hackathon_id],
		references: [hackathon.id],
	}),
}));

export const team_socialRelations = relations(team_social, ({ one }) => ({
	team: one(team, {
		fields: [team_social.team_id],
		references: [team.id],
	}),
}));
