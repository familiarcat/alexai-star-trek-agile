# 🔧 **Supabase Setup Guide for Shared Database**

## 🎯 **Objective**
Configure Supabase so both your local development and production Vercel deployment use the same database with identical initial project data.

## 📋 **Step 1: Create Supabase Project**

### **1.1 Go to Supabase**
1. Visit [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"

### **1.2 Project Configuration**
- **Name**: `alexai-star-trek-agile`
- **Database Password**: Choose a strong password (save this!)
- **Region**: Select closest to your location
- **Pricing Plan**: Free tier (sufficient for development)

### **1.3 Get Your Credentials**
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🗄️ **Step 2: Create Database Tables**

### **2.1 Open SQL Editor**
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**

### **2.2 Run This SQL Script**
```sql
-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    tech_stack JSONB DEFAULT '[]',
    team_members JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    priority VARCHAR(50) DEFAULT 'medium',
    assignee VARCHAR(255),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    tags JSONB DEFAULT '[]',
    story_points INTEGER,
    dependencies JSONB DEFAULT '[]'
);

-- Create sprints table
CREATE TABLE sprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    goals JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write access (for demo purposes)
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON projects FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON tasks FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON sprints FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON sprints FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON sprints FOR UPDATE USING (true);
```

## 🔧 **Step 3: Configure Local Environment**

### **3.1 Create .env.local File**
```bash
cp env.example .env.local
```

### **3.2 Edit .env.local**
Replace the placeholder values with your actual Supabase credentials:

```env
# Development Environment
NODE_ENV=development

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Database Configuration
DATABASE_URL=sqlite:./storage/database/agile_manager.db

# Supabase Configuration (REPLACE WITH YOUR ACTUAL VALUES)
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here

# AI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3000
API_PORT=8000
```

## 🌐 **Step 4: Configure Vercel Environment**

### **4.1 Go to Vercel Dashboard**
1. Visit [vercel.com](https://vercel.com)
2. Go to your project: `alexai_katra_transfer_package_remote_v7`

### **4.2 Add Environment Variables**
1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### **4.3 Redeploy**
1. Go to **Deployments**
2. Click **Redeploy** on your latest deployment

## 🚀 **Step 5: Test the Setup**

### **5.1 Start Local Development**
```bash
npm run dev
```

### **5.2 Seed Initial Data**
Visit: `http://localhost:3000/api/projects` with POST method to seed data

### **5.3 Test Both Environments**
- **Local**: http://localhost:3000
- **Production**: https://alexaikatratransferpackageremotev7-3b6hz7zs2-pbradygeorgen.vercel.app

### **5.4 Verify Data Sharing**
1. Create a project locally
2. Check if it appears in production
3. Create a task in production
4. Check if it appears locally

## 🎯 **Expected Results**

### **✅ Both Environments Should Show:**
- Same project list
- Same task list
- Same dashboard statistics
- Real-time data synchronization

### **✅ Database Features:**
- **Projects**: 5 initial Star Trek themed projects
- **Tasks**: 5 initial tasks with proper project associations
- **Real-time**: Changes in one environment appear in the other
- **Persistent**: Data survives deployments and restarts

## 🔍 **Troubleshooting**

### **If Local Shows Fallback Data:**
- Check `.env.local` file exists
- Verify Supabase credentials are correct
- Ensure Supabase project is active

### **If Production Shows Fallback Data:**
- Check Vercel environment variables
- Redeploy after adding environment variables
- Verify Supabase project is accessible

### **If Database Connection Fails:**
- Check Supabase project status
- Verify RLS policies are correct
- Test connection in Supabase dashboard

## 🎉 **Success Indicators**

### **✅ Working Setup:**
- Both environments show identical data
- Creating items in one environment appears in the other
- Dashboard stats are consistent
- No "fallback data" messages in API responses

### **✅ Ready for Development:**
- Local development with hot reload
- Production deployment with shared database
- Real-time data synchronization
- Authentic LCARS interface on both environments

---

**Once configured, both your local and production environments will share the same Supabase database, ensuring identical data and a seamless development experience!** 