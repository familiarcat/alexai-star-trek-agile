# 🚀 **Vercel + Supabase Deployment Guide**

## 📋 **Prerequisites**
- ✅ GitHub repository: `https://github.com/familiarcat/alexai-star-trek-agile`
- ✅ Supabase account: [supabase.com](https://supabase.com)
- ✅ Vercel account: [vercel.com](https://vercel.com)
- ✅ OpenAI API key: [platform.openai.com](https://platform.openai.com)

## 🗄️ **Step 1: Set Up Supabase Database**

### **1.1 Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. **Project Settings**:
   - **Name**: `alexai-star-trek-agile`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
   - **Pricing Plan**: Free tier (or Pro if needed)

### **1.2 Get Supabase Credentials**
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **1.3 Create Database Tables**
Run this SQL in Supabase SQL Editor:

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

-- Create policies for public read/write access
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

## 🌐 **Step 2: Deploy to Vercel**

### **2.1 Import Repository**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `alexai-star-trek-agile`
4. Vercel will auto-detect Python Flask

### **2.2 Configure Environment Variables**
In Vercel project settings, add these environment variables:

```
OPENAI_API_KEY=sk-your-openai-api-key-here
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FLASK_ENV=production
FLASK_SECRET_KEY=your-secret-key-here
```

### **2.3 Deploy**
1. Click "Deploy"
2. Vercel will build and deploy your app
3. Your app will be available at: `https://alexai-star-trek-agile.vercel.app`

## 🔧 **Step 3: Local Development with Supabase**

### **3.1 Set Up Local Environment**
Create a `.env` file in your project root:

```bash
# Copy from .env.example
cp .env.example .env
```

Edit `.env` with your actual values:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FLASK_ENV=development
FLASK_SECRET_KEY=your-local-secret-key
```

### **3.2 Install Dependencies**
```bash
pip install -r requirements.txt
```

### **3.3 Run Locally**
```bash
./start_local.sh
```

Your app will run at: `http://localhost:8000`

## 🔄 **Step 4: Database Synchronization**

### **4.1 Local ↔ Production Sync**
- **Local Development**: Uses Supabase database (same as production)
- **Production**: Uses same Supabase database
- **Data Sharing**: All data is automatically shared between environments

### **4.2 Mock Data Population**
1. **Local**: Click "Create Mock Data" button in the dashboard
2. **Production**: Use the same button or run the mock data script
3. **Data Persistence**: All data is stored in Supabase and shared

## 📊 **Step 5: Monitoring & Management**

### **5.1 Supabase Dashboard**
- **Database**: Monitor tables, queries, and performance
- **Authentication**: Manage users and permissions
- **Storage**: File uploads and media management
- **Edge Functions**: Serverless functions

### **5.2 Vercel Dashboard**
- **Deployments**: Monitor deployment status
- **Analytics**: Track performance and usage
- **Functions**: Monitor serverless function logs
- **Domains**: Manage custom domains

## 🔐 **Step 6: Security & Environment Variables**

### **6.1 Environment Variables**
- **Local**: Use `.env` file (not committed to git)
- **Production**: Set in Vercel dashboard
- **Secrets**: Never commit API keys to git

### **6.2 Database Security**
- **Row Level Security**: Enabled on all tables
- **Public Access**: Read/write access for demo purposes
- **Production**: Add authentication for user-specific data

## 🎯 **Step 7: Testing Your Deployment**

### **7.1 Verify Local Development**
```bash
curl http://localhost:8000
# Should return the dashboard HTML
```

### **7.2 Verify Production**
```bash
curl https://your-app.vercel.app
# Should return the dashboard HTML
```

### **7.3 Test Database Connection**
1. Create a project locally
2. Check if it appears in production
3. Create a task in production
4. Check if it appears locally

## 🚀 **Step 8: Custom Domain (Optional)**

### **8.1 Add Custom Domain**
1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Configure DNS records

### **8.2 SSL Certificate**
- Vercel automatically provides SSL certificates
- HTTPS is enabled by default

## 📈 **Step 9: Scaling & Performance**

### **9.1 Database Scaling**
- **Free Tier**: 500MB database, 2GB bandwidth
- **Pro Tier**: 8GB database, 250GB bandwidth
- **Enterprise**: Custom limits

### **9.2 Vercel Scaling**
- **Free Tier**: 100GB bandwidth, 100 serverless function executions
- **Pro Tier**: 1TB bandwidth, unlimited function executions
- **Enterprise**: Custom limits

## 🎉 **Success!**

Your Star Trek TNG Agile Project Manager is now:
- ✅ **Deployed to Vercel**: Live at `https://your-app.vercel.app`
- ✅ **Connected to Supabase**: Shared database between local and production
- ✅ **Environment Variables**: Securely configured
- ✅ **Ready for Development**: Local and production environments synchronized

**Live long and prosper! 🖖** 