#!/bin/bash
# Setup Database - Run all migrations on your Supabase database
# This script helps you set up the database tables needed for dosreb.com

set -e  # Exit on error

echo "🗄️  Dosreb.com Database Setup"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials."
    exit 1
fi

# Load environment variables
export $(cat .env.local | grep -v '^#' | xargs)

# Check required variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL not set in .env.local"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY not set in .env.local"
    exit 1
fi

echo "✅ Environment variables loaded"
echo "📍 Supabase URL: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

# Function to run a migration
run_migration() {
    local migration_file=$1
    local migration_name=$(basename "$migration_file")
    
    echo "📄 Running migration: $migration_name"
    
    # Read the SQL file
    SQL_CONTENT=$(cat "$migration_file")
    
    # Execute via Supabase REST API
    RESPONSE=$(curl -s -X POST \
        "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql" \
        -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
        -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
        -H "Content-Type: application/json" \
        -d "{\"query\": $(echo "$SQL_CONTENT" | jq -Rs .)}" \
        2>&1)
    
    # Note: Supabase doesn't have a direct SQL execution endpoint in the REST API
    # So we'll use a different approach with psql if available, or show instructions
    
    echo "   To run this migration, use one of these methods:"
    echo ""
    echo "   Method 1 - Supabase Dashboard:"
    echo "   1. Go to: ${NEXT_PUBLIC_SUPABASE_URL/https:\/\//https://app.supabase.com/project/}/editor"
    echo "   2. Click 'SQL Editor'"
    echo "   3. Paste the contents of: $migration_file"
    echo "   4. Click 'Run'"
    echo ""
    echo "   Method 2 - Supabase CLI:"
    echo "   supabase db query < $migration_file"
    echo ""
}

# List all migration files
MIGRATIONS=(
    "db/migrations/001_init.sql"
    "db/migrations/002_add_user_profiles.sql"
    "db/migrations/003_plan_library.sql"
)

echo "📋 Found ${#MIGRATIONS[@]} migrations to run"
echo ""

# Check if psql is available
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL client (psql) detected"
    echo ""
    echo "Do you want to run migrations now using psql? (y/n)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        # Extract connection info from Supabase URL
        # Format: https://[project-ref].supabase.co
        PROJECT_REF=$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed -E 's/https:\/\/([^.]+).*/\1/')
        DB_HOST="db.${PROJECT_REF}.supabase.co"
        
        echo "📍 Database host: $DB_HOST"
        echo "🔑 Using service role key for authentication"
        echo ""
        
        for migration in "${MIGRATIONS[@]}"; do
            if [ -f "$migration" ]; then
                echo "▶️  Running: $(basename "$migration")"
                PGPASSWORD="${SUPABASE_SERVICE_ROLE_KEY}" psql \
                    -h "$DB_HOST" \
                    -p 5432 \
                    -U postgres \
                    -d postgres \
                    -f "$migration"
                echo "   ✅ Completed"
                echo ""
            else
                echo "   ⚠️  File not found: $migration"
            fi
        done
        
        echo "🎉 All migrations completed!"
    fi
else
    echo "ℹ️  PostgreSQL client (psql) not found"
    echo ""
    echo "Please run migrations manually using one of these methods:"
    echo ""
    
    for migration in "${MIGRATIONS[@]}"; do
        if [ -f "$migration" ]; then
            run_migration "$migration"
        fi
    done
fi

echo ""
echo "📚 After running migrations, don't forget to:"
echo "   1. Create a storage bucket named 'projects' in Supabase Storage"
echo "   2. Create a storage bucket named 'plan-library' in Supabase Storage"
echo "   3. Set public access policies if needed"
echo ""
echo "💡 Quick setup using Supabase Dashboard:"
echo "   ${NEXT_PUBLIC_SUPABASE_URL/https:\/\//https://app.supabase.com/project/}"
echo ""
