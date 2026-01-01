# Domain Setup Guide: dosreb.com

## ✅ Completed
- Updated all code references from dosbre.com to dosreb.com
- Updated package.json and regenerated package-lock.json
- Cleaned up duplicate folders
- Created Vercel configuration

## 🔧 Manual Steps Required

### 1. Rename GitHub Repository
The GitHub CLI doesn't have permission to rename the repository automatically.

**Manual steps:**
1. Go to https://github.com/Furumar/dosbre.com/settings
2. Scroll down to "Repository name"
3. Change from `dosbre.com` to `dosreb.com`
4. Click "Rename"
5. Update your local git remote:
   ```bash
   git remote set-url origin https://github.com/Furumar/dosreb.com.git
   ```

### 2. GoDaddy DNS Configuration
In your GoDaddy account (https://dcc.godaddy.com/):

1. Go to **My Products** → **Domains** → Click on dosreb.com
2. Click **DNS** or **Manage DNS**
3. Add/Update these records:

**For Vercel:**
- **A Record**
  - Name: `@`
  - Value: `76.76.21.21`
  - TTL: 600 seconds (or default)

- **CNAME Record**
  - Name: `www`
  - Value: `cname.vercel-dns.com`
  - TTL: 1 Hour (or default)

**For other hosting providers:**
Replace the IP/CNAME with your provider's values.

### 3. Deploy to Vercel

If not already deployed:
```bash
npm install -g vercel
vercel login
vercel --prod
```

Then in Vercel Dashboard:
1. Go to your project settings
2. Navigate to **Domains**
3. Add `dosreb.com` as custom domain
4. Add `www.dosreb.com` as custom domain
5. Vercel will automatically provision SSL certificates

### 4. Test Your Domain
After DNS propagation (5-30 minutes):
- Visit https://dosreb.com
- Visit https://www.dosreb.com
- Check SSL certificate is valid

### 5. Optional: Redirect Old Domain
If you still own dosbre.com and want to redirect traffic:
- Keep dosbre.com pointing to the same hosting
- Add a redirect rule in your hosting platform
