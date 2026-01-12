# Real Estate & Project Management Setup Guide

This guide will help you set up the complete system for managing real estate projects with file storage.

## 1. Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from Settings > API

### Run Database Migrations

```bash
cd db
chmod +x run_migrations.sh
./run_migrations.sh
```

Or run manually in Supabase SQL Editor:
- Copy contents of `db/migrations/001_init.sql`
- Execute in Supabase Dashboard > SQL Editor

### Create Storage Bucket

In Supabase Dashboard > Storage:

1. Click "New Bucket"
2. Name: `projects`
3. Public: **No** (private bucket)
4. File size limit: 50MB
5. Allowed MIME types:
   - `image/*`
   - `application/pdf`
   - `application/vnd.*`
   - `application/msword`
   - `text/*`

### Set Storage Policies

In the Storage bucket policies, add:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload project files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'projects');

-- Allow users to read their own project files
CREATE POLICY "Users can read project files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'projects');

-- Allow users to delete their own project files
CREATE POLICY "Users can delete project files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'projects');
```

## 2. Environment Variables

Create or update your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Supabase Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get these values from: Supabase Dashboard > Settings > API

## 3. Install Dependencies

Make sure you have the Supabase client installed:

```bash
npm install @supabase/supabase-js
```

## 4. Test the Setup

1. Start development server:
```bash
npm run dev
```

2. Navigate to: `http://localhost:3000/en/real-estates`

3. Test the workflow:
   - Click "New Project"
   - Create a project with title and description
   - Click "View" on the project
   - Upload files using drag-and-drop or file picker
   - View uploaded files in the gallery
   - Click on files to preview (images and PDFs)
   - Delete files using the × button

## 5. Features

### Project Management
- ✅ Create, edit, delete projects
- ✅ Search and filter projects
- ✅ Project visibility settings (private/public/unlisted)

### File Management
- ✅ Drag-and-drop upload
- ✅ Organize by folder (Documents, Designs, Photos)
- ✅ File preview (images and PDFs)
- ✅ File gallery with filtering
- ✅ Secure file storage with Supabase
- ✅ File size and type validation

### Supported File Types
- **Images**: JPG, PNG, GIF, WebP, SVG
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- **Text**: TXT, CSV, MD

## 6. Next Steps

### Add Authentication
Currently using a mock user ID. To add real authentication:

1. Enable Supabase Auth:
   - Supabase Dashboard > Authentication
   - Enable providers (Email, Google, etc.)

2. Update API routes to use real user:
   - Replace `MOCK_USER_ID` in `/app/[locale]/api/projects/route.ts`
   - Replace `MOCK_USER_ID` in `/app/[locale]/api/files/route.ts`

Example with Supabase Auth:
```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabase = createRouteHandlerClient({ cookies });
const { data: { session } } = await supabase.auth.getSession();
const userId = session?.user?.id;
```

### Add Collaboration Features
- Implement invites system (table already exists)
- Add role-based permissions
- Add comments on files
- Add activity feed

### Optimize File Uploads
- Add image compression
- Generate thumbnails server-side
- Add progress tracking
- Add virus scanning

### Add Advanced Features
- Real-time updates with Supabase Realtime
- File versioning
- Annotations on images/PDFs
- Export projects as ZIP
- Share public links

## 7. Troubleshooting

### Files Not Uploading
- Check Supabase Storage bucket exists and is named `projects`
- Verify CORS settings in Supabase
- Check file size limits (default: 50MB)
- Verify storage policies are set correctly

### Database Errors
- Ensure migrations have run successfully
- Check RLS (Row Level Security) policies
- Verify environment variables are set

### Preview Not Working
- For PDF preview, ensure browser supports PDF rendering
- Check signed URL expiration time
- Verify storage policies allow SELECT

## 8. Production Deployment

Before deploying to production:

1. Set environment variables in Vercel:
   - Dashboard > Settings > Environment Variables
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Update CORS in Supabase:
   - Add your production domain
   - Supabase Dashboard > Settings > API > CORS

3. Review security policies:
   - Test RLS policies thoroughly
   - Add rate limiting
   - Enable logging

4. Optimize performance:
   - Enable CDN for Supabase Storage
   - Add caching headers
   - Compress images before upload

## 9. API Reference

### Projects API

**Create Project**
```
POST /api/projects
Body: { title, description, visibility }
```

**Get Projects**
```
GET /api/projects
```

**Get Single Project**
```
GET /api/projects?id={projectId}
```

**Update Project**
```
PUT /api/projects?id={projectId}
Body: { title, description, visibility }
```

**Delete Project**
```
DELETE /api/projects?id={projectId}
```

### Files API

**Upload File**
```
POST /api/files
FormData: { file, projectId, folder }
```

**Get Project Files**
```
GET /api/files?projectId={projectId}
```

**Get File URL**
```
GET /api/files?filePath={storagePath}
```

**Delete File**
```
DELETE /api/files?id={fileId}&storagePath={path}
```

---

**Ready to start!** Visit `/en/real-estates` to begin managing your projects.
