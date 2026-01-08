# Project Photo Upload Fixes

## Issues Fixed

### 1. **Storage Bucket Configuration**
- ✅ Made the `projects` storage bucket **public** for easier image access
- ✅ Verified bucket exists and is properly configured
- ✅ Updated `getFileUrl()` function to use public URLs when bucket is public

### 2. **Upload Error Handling**
- ✅ Added better error messages in the reference-projects upload route
- ✅ Added specific error detection for missing storage bucket
- ✅ Improved admin page to show detailed error messages

### 3. **File Retrieval**
- ✅ Confirmed files are being stored correctly in Supabase Storage
- ✅ Verified URL generation is working properly
- ✅ Public URLs are now accessible without signed URLs

## Current State

### Stockmann Project
- **Location**: `projects/stockmann/photos/`
- **Files**: 4 images uploaded successfully
- **URLs**: All accessible via public URLs

### DB Schenker Project
- **Location**: `projects/dbschenker/photos/`
- **Files**: 7 images uploaded successfully

### Jätkäsaari Project
- **Location**: `projects/jatkasaari/photos/`
- **Files**: 2 images uploaded successfully

## How to Upload Photos

1. Navigate to `/en/projects/admin` (or any other locale)
2. Select the project from the dropdown (Stockmann, DB Schenker, or Jätkäsaari)
3. Click "Choose Images to Upload" and select multiple images
4. Images will be uploaded to `projects/{project-name}/photos/` in Supabase Storage
5. Images will automatically appear on the respective project pages

## File Structure

```
Supabase Storage: projects bucket (PUBLIC)
├── stockmann/
│   └── photos/
│       ├── 1767874491508_Stockmann_kasvu.jpg
│       ├── 1767874490829_Stockmann_kasvu_2.jpg
│       ├── 1767874489789_Stockmann_kasvu_5.jpg
│       └── 1767874101139____1.webp
├── dbschenker/
│   └── photos/
│       └── (7 images)
└── jatkasaari/
    └── photos/
        └── (2 images)
```

## Technical Details

### Upload Route
- **Endpoint**: `/api/reference-projects/upload`
- **Method**: POST
- **Parameters**:
  - `file`: File object
  - `project`: Project name (stockmann, dbschenker, or jatkasaari)
  - `folder`: Folder type (default: photos)

### File Retrieval Route
- **Endpoint**: `/api/files?project={project}&folder={folder}`
- **Method**: GET
- **Returns**: Array of files with public URLs

### Storage Helper
- **Location**: `lib/supabase/storage.ts`
- **Key Function**: `getFileUrl()` - Returns public URL for public buckets, signed URL for private buckets

## Scripts Created

1. **setup-storage.ts** - Verifies/creates storage bucket
2. **make-bucket-public.ts** - Makes bucket public
3. **list-project-files.ts** - Lists all files in project folders
4. **test-file-retrieval.ts** - Tests URL generation

## Next Steps for Testing

1. Start the development server: `npm run dev`
2. Visit `/en/projects/stockmann` to see the images
3. Try uploading new images via `/en/projects/admin`
4. Verify images appear on the project page

## Troubleshooting

If uploads still fail:
1. Check Supabase Storage policies in the dashboard
2. Verify the bucket is public or has appropriate access policies
3. Check browser console for detailed error messages
4. Verify environment variables are set correctly:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
