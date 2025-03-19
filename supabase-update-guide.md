# Guide to Update Supabase Credentials

This project uses Supabase for authentication and database functions. To update to your new Supabase account, follow these steps:

## Step 1: Get Your New Supabase Credentials
1. Log in to your new Supabase account
2. Create a new project (if not already done)
3. Go to Project Settings > API
4. Copy the following information:
   - Project URL (anon public)
   - Project API Key (anon public)

## Step 2: Update Your Environment Variables
Create or update your `.env` file in the root directory with the following variables:

```
REACT_APP_SUPABASE_URL=your_new_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_new_supabase_anon_key
```

Replace `your_new_supabase_project_url` and `your_new_supabase_anon_key` with the values from Step 1.

## Step 3: Restart Your Development Server
After updating the `.env` file, restart your development server:

```
npm start
```

## Step 4: Verify Supabase Connection
Try using features that require Supabase (like login/signup) to verify the connection is working properly.

## Step 5: Update Database Structure
Since you're using a new Supabase project, you'll need to recreate your database structure:

1. Create the same tables in your new Supabase project
2. Define the same columns with correct data types
3. Set up the same Row Level Security (RLS) policies if used
4. Recreate any storage buckets if your app uses Supabase Storage

## Migrating Data (Optional)
If you need to migrate data from your old Supabase project:

1. Export data from your old project (SQL or CSV)
2. Import data into your new project
3. Verify all relationships are maintained

## Note About Authentication
Users from your old Supabase project won't automatically be available in the new one. They will need to sign up again unless you specifically migrate user data.
