// src/db/schema.js
import {
  pgTable,
  text,
  uuid,
  boolean,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

// Brokers table
export const brokers = pgTable("brokers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  specialties: text("specialties").array().notNull().default([]),
  phone: text("phone"),
  email: text("email"),
  city: text("city"),
  active: boolean("active").notNull().default(true),
  googleSheetId: text("google_sheet_id").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Leads table
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: text("phone").notNull(),
  product: text("product").notNull(),

  name: text("name"),
  age: integer("age"),
  city: text("city"),
  incomeRange: text("income_range"),
  familyMembers: integer("family_members"),
  currentInsurer: text("current_insurer"),
  coverageAmount: text("coverage_amount"),
  preexistingConditions: text("preexisting_conditions"),

  assignedBrokerId: uuid("assigned_broker_id").references(() => brokers.id),

  status: text("status").notNull().default("collecting"),
  userRating: integer("user_rating"),
  userFeedback: text("user_feedback"),
  brokerReportedStatus: text("broker_reported_status"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  sentToBrokerAt: timestamp("sent_to_broker_at", { withTimezone: true }),
  closedAt: timestamp("closed_at", { withTimezone: true }),
});

// Sessions table
export const sessions = pgTable("sessions", {
  phone: text("phone").primaryKey(),
  threadId: text("thread_id"),
  currentProduct: text("current_product"),
  currentLeadId: uuid("current_lead_id").references(() => leads.id),
  missingFields: jsonb("missing_fields").default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});