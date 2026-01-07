# Vercel Environment Variables Setup

## Critical: Your site won't work without these environment variables!

All functionality (Lumi chat, projects, real estates) requires these environment variables to be configured in Vercel.

## Required Environment Variables

### 1. Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Groq API (for Lumi chat)
```
GROQ_API_KEY=your_groq_api_key
```

## How to Add Environment Variables in Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your project (dosreb.com)
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Variable Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: (paste your Supabase URL)
   - Environment: Select **Production**, **Preview**, and **Development**
   - Click **Save**
5. Repeat for all four variables above

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GROQ_API_KEY
```

## After Adding Environment Variables

**IMPORTANT:** You must redeploy for the changes to take effect:

### Option 1: Trigger Redeploy in Dashboard
1. Go to Vercel Dashboard → Deployments
2. Click the **...** menu on latest deployment
3. Select **Redeploy**

### Option 2: Push a commit
```bash
git commit --allow-empty -m "Trigger redeploy with environment variables"
git push origin main
```

### Option 3: Via Vercel CLI
```bash
vercel --prod
```

## Getting Your Credentials

### Supabase Credentials
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### Groq API Key
1. Go to https://console.groq.com
2. Create an account if needed
3. Go to **API Keys**
4. Create a new API key → `GROQ_API_KEY`

## Verify Setup

After redeploying, test each feature:

1. **Lumi Chat**: Visit /lumi and try sending a message
2. **Projects**: Go to /projects/manage and try creating a project
3. **Real Estates**: Go to /real-estates and try creating a real estate project

## Troubleshooting

### Lumi not responding
- Check GROQ_API_KEY is set in Vercel
- Check browser console for errors

### Projects/Real Estates not loading
- Check all three SUPABASE variables are set
- Verify database tables exist (run migrations)
- Check browser console for 500 errors

### Still not working after adding variables
- Verify you redeployed after adding variables
- Check Vercel deployment logs for errors
- Environment variables only take effect after redeployment
