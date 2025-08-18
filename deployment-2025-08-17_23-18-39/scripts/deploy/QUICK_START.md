# 🚀 Production Deployment Quick Start Guide

## 🎯 Goal: Get Your 10 AM Daily Emails Working!

This guide will walk you through deploying your AlexAI Star Trek Agile System to production so you can receive daily execution plan emails at 10:00 AM.

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Run the n8n production integration script
- ✅ Generated workflow and database files
- ✅ Supabase account (free tier works)
- ✅ Email service (SendGrid recommended, or Gmail SMTP)

## 🚀 Deployment Steps

### Step 1: Start Deployment
```bash
cd /path/to/alexai_katra_transfer_package_remote_v7
./scripts/deploy/production-deployment.sh
```

This will:
- ✅ Check prerequisites
- ✅ Create `.env.production` file
- ⏸️ Pause for credential configuration

### Step 2: Configure Credentials
Edit the `.env.production` file with your actual credentials:

#### Supabase Configuration
```bash
# Get these from your Supabase project dashboard
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Email Configuration (Choose One)

**Option A: SendGrid (Recommended)**
```bash
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=brady@pbradygeorgen.com
SENDGRID_FROM_NAME="AlexAI Star Trek System"
```

**Option B: Gmail SMTP**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
SMTP_FROM=brady@pbradygeorgen.com
```

### Step 3: Complete Deployment
```bash
./scripts/deploy/production-deployment.sh --continue
```

This will:
- 🗄️ Deploy Supabase database
- 🔄 Set up N8N workflow
- 📧 Configure email service
- 🧪 Test the system
- 📋 Generate deployment summary

### Step 4: Import N8N Workflow
1. Open N8N at `http://localhost:5678`
2. Go to Workflows
3. Click "Import from file"
4. Select: `workflows/weekly-execution-plan-workflow.json`
5. Configure credentials for Supabase and email nodes
6. Activate the workflow

### Step 5: Test the System
1. Run the workflow manually in N8N
2. Check email delivery
3. Verify database entries
4. Monitor workflow execution

## 📧 Expected Result

After successful deployment, you should receive:
- **Daily emails at 10:00 AM** with your execution plan
- **Database entries** tracking your progress
- **Automated workflow execution** every day

## 🔧 Troubleshooting

### Common Issues

**Supabase Connection Failed**
- Verify your Supabase URL and keys
- Check if your project is active
- Ensure you have the correct permissions

**Email Not Sending**
- Verify API keys or SMTP credentials
- Check email service quotas
- Test with a simple email first

**N8N Workflow Not Running**
- Verify workflow is active
- Check cron trigger configuration
- Review workflow logs for errors

### Getting Help

1. Check the deployment summary: `output/deployment-summary.md`
2. Review N8N workflow logs
3. Check Supabase dashboard for database status
4. Verify environment variables in `.env.production`

## 🎉 Success Indicators

You'll know the deployment is successful when:
- ✅ Supabase database is accessible
- ✅ N8N workflow is imported and active
- ✅ Email service is configured
- ✅ Manual workflow execution works
- ✅ Daily emails arrive at 10:00 AM

## 🚀 Next Steps After Deployment

1. **Monitor the first few days** to ensure reliability
2. **Customize the execution plan** if needed
3. **Set up monitoring** for workflow health
4. **Scale up** by adding more automation

---

**"Make it so. Engage." - Captain Picard** 🚀

Your AlexAI Star Trek Agile System will now automatically manage your daily execution tasks and send you the plan every morning at 10:00 AM!
