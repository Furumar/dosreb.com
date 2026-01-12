# DOSREB — Real Estate & Project Management MVP

Date: 2026-01-03
Author: Engineering (proposal)

## Purpose
Provide a concise technical design and wireframe for a minimum viable product (MVP) that adds real-estate and project creation, file/media management, and basic collaboration to Dosreb.com.

Goals:
- Allow users to create and manage projects/properties
- Upload and organize documents, drawings, and photos via drag-and-drop
- View images and PDFs and leave comments/annotations
- Invite collaborators with simple roles (owner/editor/viewer)
- Ship a secure, maintainable MVP within a few weeks

Non-goals for MVP:
- Full real-time co-editing of Office documents (OnlyOffice integration optional later)
- Complex workflow automation (deferred)

---

## High-level architecture

- Frontend: Next.js (existing app, App Router). React components, Tiptap for rich text (future), PDF.js for PDF viewing, Annotorious for annotations.
- Backend: Postgres (Supabase or managed Postgres) for metadata and relations.
- Storage: S3-compatible object storage (AWS S3 or Supabase Storage) for files and thumbnails. Use pre-signed uploads.
- Realtime: Supabase Realtime / Pusher / Ably for presence and live comments (optional for initial MVP — polling acceptable at first).
- Auth: Reuse existing auth or integrate NextAuth/Supabase Auth (team/org model later).

Deployment: Vercel for frontend, serverless API routes or dedicated small API service for uploads presigning and heavier tasks. CI/CD: GitHub Actions (already added).

---

## MVP feature set

1. Project / Property CRUD
   - Create, edit, delete projects (title, address, description, tags, template)
   - List & search projects

2. Drag-and-drop uploads
   - Drag files into a project's upload area
   - Client requests a pre-signed upload URL from backend
   - Upload directly to S3, backend records metadata
   - Generate thumbnails for images; generate PDF preview images or use PDF.js

3. File gallery & viewer
   - Grid/list of files, sorting, filtering by type
   - Viewer: image fullscreen, PDF viewer with page navigation

4. Comments & annotations
   - Per-file comments (threaded minimal), optional x/y coords for image annotations
   - Simple moderation: edit/delete by owner

5. Invitations & roles
   - Invite by email to a project with role: owner/editor/viewer

6. Basic activity feed and task/milestone fields (meta)

---

## Data model (simplified)

Tables (Postgres):

- users
  - id (uuid), email, name, avatar_url, created_at

- projects
  - id (uuid), owner_id (users), title, address, description, template_id, visibility, created_at, updated_at

- files
  - id (uuid), project_id, uploader_id, filename, storage_path, mime_type, size, width, height, thumbnail_path, metadata(json), created_at

- comments
  - id (uuid), file_id, user_id, body, parent_id, x, y, page_index, created_at

- invites
  - id, project_id, email, role, token, status, created_at

- templates
  - id, owner_id, name, schema (json), created_at

Indexes: projects.owner_id, files.project_id, comments.file_id

---

## API endpoints (examples)

All endpoints protected; returns JSON.

Auth endpoints handled separately.

- POST /api/projects
  - body: { title, address, description }
  - returns project

- GET /api/projects
  - query: owner, search, pagination

- GET /api/projects/:id

- POST /api/projects/:id/presign
  - body: { filename, mime, size }
  - returns: { url, fields, uploadPath }

- POST /api/files/notify
  - called by client after successful S3 upload
  - body: { project_id, filename, storage_path, mime, size, width?, height? }

- GET /api/files/:id

- POST /api/files/:id/comments

- GET /api/projects/:id/invite
- POST /api/projects/:id/invite

---

## Security & operational notes

- Use signed upload URLs with short TTL; do not route file bytes through the API.
- Enforce file type and size limits server-side and client-side.
- Use serverless functions or a lightweight worker to create thumbnails (image resizing) and PDF preview images.
- Consider virus scanning integration (ClamAV or third-party service) for production.
- Set cookie/session secure flags; enforce CORS correctly for direct S3 uploads.

---

## Wireframes (textual)

1) Projects List (dashboard)

------------------------------------------------------------
| DOSREB header (logo, nav, profile)                        |
------------------------------------------------------------
| [New Project] [Search ▾]                                   |
| --------------------------------------------------------   |
| | Project Card | Project Card | Project Card | ... |      |
| --------------------------------------------------------   |
| Pagination / filters                                       |
------------------------------------------------------------

2) Project detail / media manager

------------------------------------------------------------
| Project title  | Invite button | Actions (Edit, Delete)  |
------------------------------------------------------------
| Left: Upload pane (drag & drop) | Right: Files gallery    |
| - Drop area (drag files here)   | - Thumbnails grid       |
| - Recent uploads list            | - click => Viewer       |
------------------------------------------------------------
| File Viewer (modal or right panel)                         |
| - toolbar: zoom, annotate, download, comment               |
| - center: image or PDF.js viewer                           |
| - right: comment threads & add comment box                  |
------------------------------------------------------------

3) Upload flow (client)

1. User drags files onto drop area.
2. Client calls `POST /api/projects/:id/presign` for each file.
3. Client PUTs file to S3 using returned pre-signed URL.
4. Client calls `POST /api/files/notify` to record metadata.
5. Backend queues thumbnail generation and returns file record.

---

## Deployment & timeline (rough)

- Week 1: Data model + project CRUD + file metadata + presign endpoint
- Week 2: Drag-and-drop UI + direct uploads + thumbnail generation
- Week 3: File viewer (images + PDFs) + comments
- Week 4: Invitations, permissions, polish, E2E tests

---

## Next steps / choices for you

1. Confirm backend hosting preference: Supabase (fast), AWS (more setup), or Neon/Postgres.
2. Confirm storage choice: Supabase Storage or S3.
3. Decide if realtime comments are required for MVP or can be deferred.

Once you confirm choices I can produce a scoped implementation plan and start the first sprint (Project CRUD + presigned uploads).

---

## Revision history

-- 2026-01-03 — Initial draft

---

## Refined choices (recommended)

Summary — recommended stack for fastest, secure delivery with room to scale:

- Backend & DB: Supabase (Postgres) — provides hosted Postgres, row-level security, Auth, and easy integration with Next.js. Rapid development, built-in Realtime, and serverless functions.
- Storage: Supabase Storage (S3-compatible) for user files, thumbnails, and derived assets. Simpler than provisioning S3 and integrates with Supabase Auth for secure access.
- Realtime / Collaboration: Use Supabase Realtime for comments/presence for MVP. If you need richer collaboration (low-latency presence, channels, or advanced features), Pusher or Ably are alternatives.

Rationale:
- Speed of implementation: Supabase bundles Postgres, Auth, Storage and Realtime so we can ship core features (projects, uploads, comments) in days rather than weeks.
- Security: Row-level security (RLS) policies and authenticated storage access reduce attack surface vs rolling your own signed-URL system initially.
- Cost & operations: Supabase handles infra (backups, scaling) — lower operational burden for an MVP. When scale requires, it's straightforward to migrate storage to S3 and Postgres to a dedicated provider.

Trade-offs:
- Supabase is slightly higher vendor lock-in than building on AWS primitives, but migration paths are well-known (export DB, move storage to S3).
- Supabase Realtime is adequate for comments/presence; for massive concurrent collaboration or advanced channel features, consider Pusher later.

Security & upload model (Supabase)

1. Authentication: use Supabase Auth for sign-ins (email magic link or OAuth). Frontend uses `@supabase/supabase-js` with the user's session.
2. Uploads (recommended flow): client calls Supabase Storage SDK `storage.from('projects').upload(path, file)` while authenticated. This avoids manual signed-URL orchestration and works with RLS + policies.
3. Server-side verification: after upload, client calls `POST /api/files/notify` (serverless function) to persist metadata and optionally trigger thumbnail generation. The server validates user's access to the project.
4. Thumbnail generation: use a background function (Supabase Edge Function or Vercel Serverless) that listens to file inserts (via webhook or DB trigger) and uses `sharp` to create thumbnails, then writes them back to Storage and updates `files.thumbnail_path`.

Realtime comments & presence

- Implement comments using a `comments` table and use Supabase Realtime to subscribe to inserts/updates for a project's files. This gives near-instant propagation to connected clients.
- Presence: for simple presence (who's viewing a file), use ephemeral presence channels via Realtime or a lightweight presence record updated on focus/heartbeat.

Scaling & migration notes

- If you outgrow Supabase Storage, copy objects to S3 and update `files.storage_path` to the S3 URL; the DB schema stays the same.
- For very high upload volumes, consider a direct presigned S3 flow with uploads to S3 and a backend verifying callbacks (S3 events) to record metadata.

Implementation steps (Supabase-focused)

1. Provision Supabase project and create `projects`, `files`, `comments`, `invites`, `templates` tables (use SQL migrations).
2. Add RLS policies so users can only access project rows they own or are invited to.
3. Add Supabase Storage bucket `projects` and set appropriate public/private rules.
4. Implement serverless endpoints in `app/api/*` for creating projects, generating upload metadata, and post-upload notifications.
5. Implement frontend components: Project list page, Project detail with Dropzone (upload), Gallery, Viewer (image/PDF) and Comments panel. Use `@supabase/supabase-js` for auth and storage.
6. Add thumbnail worker (Edge Function) and wire it to DB triggers or invoke it from the `notify` endpoint.
7. Add tests, logging, and monitoring (error reports, storage usage alerts).

Estimated time to MVP (single engineer): 2–3 weeks with Supabase (project CRUD, uploads, viewer, comments).

If you confirm, I'll expand this into a sprint plan (tasks, estimates, acceptance criteria) and begin implementation starting with schema and upload flow.
