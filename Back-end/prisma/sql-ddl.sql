-- PostgreSQL DDL for GuiTickets (approximate, generated from schema)

-- Enums
CREATE TYPE "Role" AS ENUM ('REQUESTER', 'AGENT');
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING', 'COMPLETED');
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- Users
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  role "Role" NOT NULL DEFAULT 'REQUESTER',
  gender TEXT NULL,
  phone TEXT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AssignmentGroup
CREATE TABLE IF NOT EXISTS "AssignmentGroup" (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  color TEXT NULL,
  description TEXT NULL
);

-- Ticket
CREATE TABLE IF NOT EXISTS "Ticket" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status "TicketStatus" NOT NULL DEFAULT 'OPEN',
  priority "TicketPriority" NULL,
  "relatedSystem" TEXT NULL,
  "authorId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  "assignedToId" TEXT NULL REFERENCES "User"(id) ON DELETE SET NULL ON UPDATE CASCADE,
  "completedById" TEXT NULL REFERENCES "User"(id) ON DELETE SET NULL ON UPDATE CASCADE,
  "assignmentGroupId" TEXT NULL REFERENCES "AssignmentGroup"(id) ON DELETE SET NULL ON UPDATE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Ticket_status_idx" ON "Ticket" (status);
CREATE INDEX IF NOT EXISTS "Ticket_authorId_idx" ON "Ticket" ("authorId");
CREATE INDEX IF NOT EXISTS "Ticket_assignedToId_idx" ON "Ticket" ("assignedToId");

-- TicketMessage
CREATE TABLE IF NOT EXISTS "TicketMessage" (
  id TEXT PRIMARY KEY,
  "ticketId" TEXT NOT NULL REFERENCES "Ticket"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  "authorId" TEXT NULL REFERENCES "User"(id) ON DELETE SET NULL ON UPDATE CASCADE,
  "authorName" TEXT NOT NULL,
  "authorEmail" TEXT NOT NULL,
  content TEXT NOT NULL,
  "isAgent" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Attachment
CREATE TABLE IF NOT EXISTS "Attachment" (
  id TEXT PRIMARY KEY,
  "ticketId" TEXT NOT NULL REFERENCES "Ticket"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  "mimeType" TEXT NOT NULL,
  url TEXT NOT NULL
);

-- Tags and join table
CREATE TABLE IF NOT EXISTS "Tag" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "TicketTag" (
  "ticketId" TEXT NOT NULL REFERENCES "Ticket"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  "tagId" TEXT NOT NULL REFERENCES "Tag"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY ("ticketId", "tagId")
);
