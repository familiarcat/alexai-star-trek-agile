# 🚀 Resume Compliance Auditor - Deployment Guide

## 📋 Overview

The **Resume Compliance Auditor** is a sophisticated n8n workflow that analyzes resumes using multiple professional frameworks and provides comprehensive feedback for ATS optimization and career advancement.

## ✨ Features

- **Multi-format Support**: PDF, DOCX, TXT, MD
- **Professional Scoring**: ELITE, SOAR, STAR, CAR, LPS, WHO frameworks
- **ATS Optimization**: Identifies parsing issues and keyword gaps
- **Multiple Outputs**: Markdown, Text, Word, PDF reports
- **Beautiful UI**: Professional drag-and-drop interface
- **Real-time Analysis**: Instant feedback and scoring

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   HTML Frontend │───▶│  n8n Workflow    │───▶│  Analysis      │
│   (Public UI)   │    │  (Processing)    │    │  Engine        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Upload   │    │   File Parsing   │    │   Scoring      │
│   Interface     │    │   & Conversion   │    │   Algorithms   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Deployment

### 1. **Prerequisites**

```bash
# Install required tools
brew install jq        # macOS
sudo apt-get install jq # Ubuntu/Debian

# Set your n8n API token
export N8N_API_TOKEN="your_n8n_api_token_here"
```

### 2. **Deploy to n8n.pbradygeorgen.com**

```bash
# Run the deployment script
./scripts/deploy-resume-auditor.sh
```

### 3. **Access Your Workflow**

- **Webhook URL**: `https://n8n.pbradygeorgen.com/webhook/resume-audit`
- **Public UI**: `http://localhost:3000/resume-auditor.html`

## 🔧 Manual Deployment

### **Step 1: Import Workflow to n8n**

1. Open your n8n instance at `n8n.pbradygeorgen.com`
2. Go to **Workflows** → **Import from File**
3. Upload `workflows/resume-compliance-auditor.json`
4. Click **Import**

### **Step 2: Activate the Workflow**

1. Open the imported workflow
2. Click **Activate** in the top-right corner
3. The webhook will be available at `/webhook/resume-audit`

### **Step 3: Test the Workflow**

```bash
# Test with a sample resume
curl -X POST -F "resume=@sample-resume.pdf" \
     "https://n8n.pbradygeorgen.com/webhook/resume-audit"
```

## 🌐 Public Access Setup

### **Option 1: Local Development Server**

```bash
# Serve the HTML interface locally
cd public
python3 -m http.server 8000
# Access at: http://localhost:8000/resume-auditor.html
```

### **Option 2: Deploy to Web Server**

1. Upload `public/resume-auditor.html` to your web server
2. Update the `N8N_WEBHOOK_URL` in the HTML file
3. Make it publicly accessible

### **Option 3: GitHub Pages**

1. Push the HTML file to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Access via `https://username.github.io/repository/resume-auditor.html`

## 📱 Usage Instructions

### **For End Users**

1. **Open the Resume Auditor UI**
2. **Drag & Drop** your resume file (or click to browse)
3. **Wait for Analysis** (typically 10-30 seconds)
4. **Review Results**:
   - Overall compliance score
   - Framework-specific scores
   - Strengths and improvement areas
   - ATS optimization tips
5. **Download Report** in your preferred format

### **For Developers/API Users**

```bash
# Basic usage
curl -X POST \
     -F "resume=@resume.pdf" \
     "https://n8n.pbradygeorgen.com/webhook/resume-audit"

# With custom headers
curl -X POST \
     -H "Content-Type: multipart/form-data" \
     -F "resume=@resume.docx" \
     "https://n8n.pbradygeorgen.com/webhook/resume-audit"
```

## 🔍 Framework Scoring Details

### **ELITE Framework** (Engage, Lead, Impress, Target, Execute)
- **Engage**: Strong action verbs and compelling language
- **Lead**: Leadership experience and cross-functional collaboration
- **Impress**: Quantified results and metrics
- **Target**: Clear objectives and goal orientation
- **Execute**: Implementation and delivery focus

### **SOAR Framework** (Situation, Objective, Action, Result)
- **Situation**: Context and challenge description
- **Objective**: Goals and targets
- **Action**: Specific actions taken
- **Result**: Outcomes and impact

### **STAR Framework** (Situation, Task, Action, Result)
- **Situation**: Background context
- **Task**: Responsibilities and requirements
- **Action**: Steps taken
- **Result**: Achievements and outcomes

### **CAR Framework** (Challenge, Action, Result)
- **Challenge**: Problem or obstacle faced
- **Action**: Solution implemented
- **Result**: Impact and resolution

### **LPS Framework** (Leadership, Problem-solving, Strategic)
- **Leadership**: Team management and mentoring
- **Problem-solving**: Analytical and troubleshooting skills
- **Strategic**: Long-term planning and architecture

### **WHO Framework** (Who, What, How)
- **Who**: Company recognition and credibility
- **What**: Action-oriented achievements
- **How**: Technical skills and methodologies

## ⚙️ Technical Requirements

### **n8n Server Requirements**

- **n8n Version**: 1.0.0 or higher
- **Node.js**: 18.x or higher
- **System Tools**:
  - `pandoc` (for DOCX/PDF conversion)
  - `pdftotext` (for PDF text extraction)
  - `wkhtmltopdf` (for PDF generation)

### **Installation Commands**

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install pandoc poppler-utils wkhtmltopdf

# macOS
brew install pandoc poppler wkhtmltopdf

# CentOS/RHEL
sudo yum install pandoc poppler-utils wkhtmltopdf
```

## 🧪 Testing & Validation

### **Test Resume Files**

The deployment script creates a test resume automatically. You can also test with:

```bash
# Create a test resume
cat > test-resume.txt << 'EOF'
Jane Smith
Senior Software Engineer

EXPERIENCE
Lead Developer at TechCorp (2021-2023)
- Managed team of 8 developers
- Increased system performance by 45%
- Reduced deployment time by 60%

Software Engineer at StartupXYZ (2019-2021)
- Built React frontend serving 50,000 users
- Implemented CI/CD reducing bugs by 30%
- Led agile ceremonies for 3 teams
EOF

# Test the workflow
curl -X POST -F "resume=@test-resume.txt" \
     "https://n8n.pbradygeorgen.com/webhook/resume-audit"
```

### **Expected Response Format**

```json
{
  "json": {
    "overall": 85,
    "frameworkScores": {
      "ELITE": 90,
      "SOAR": 85,
      "STAR": 80,
      "CAR": 85,
      "LPS": 90,
      "WHO": 80
    },
    "strengths": [
      "Consistent use of quantified results.",
      "Demonstrated leadership & cross-functional collaboration."
    ],
    "improvements": [
      "Add explicit Objective lines under each role.",
      "Add more numeric impact (%, $, time saved, adoption)."
    ],
    "data": "### Overview\n\n**Overall Compliance Score:** 85%\n\n..."
  }
}
```

## 🔒 Security Considerations

### **Access Control**

- **Webhook Security**: Consider implementing webhook authentication
- **Rate Limiting**: Implement request throttling to prevent abuse
- **File Validation**: Validate file types and sizes
- **Input Sanitization**: Sanitize all user inputs

### **Recommended Security Measures**

```bash
# Example: Add basic authentication to n8n
export N8N_BASIC_AUTH_ACTIVE=true
export N8N_BASIC_AUTH_USER=admin
export N8N_BASIC_AUTH_PASSWORD=secure_password

# Example: Implement rate limiting
export N8N_RATE_LIMIT_WINDOW=900000  # 15 minutes
export N8N_RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 Monitoring & Analytics

### **n8n Execution Logs**

Monitor workflow executions in the n8n interface:
- **Executions** tab shows all workflow runs
- **Logs** provide detailed execution information
- **Metrics** show performance and error rates

### **Custom Monitoring**

```bash
# Check workflow status
curl -H "Authorization: Bearer $N8N_API_TOKEN" \
     "https://n8n.pbradygeorgen.com/api/v1/workflows"

# Get execution history
curl -H "Authorization: Bearer $N8N_API_TOKEN" \
     "https://n8n.pbradygeorgen.com/api/v1/executions"
```

## 🚨 Troubleshooting

### **Common Issues**

1. **Workflow Not Activating**
   - Check n8n server status
   - Verify API token permissions
   - Check workflow syntax

2. **File Processing Errors**
   - Ensure required tools are installed (pandoc, pdftotext)
   - Check file permissions in /tmp directory
   - Verify file format support

3. **Webhook Not Responding**
   - Confirm workflow is active
   - Check webhook URL path
   - Verify CORS settings if needed

### **Debug Commands**

```bash
# Test n8n connectivity
curl -v "https://n8n.pbradygeorgen.com"

# Check workflow status
curl -H "Authorization: Bearer $N8N_API_TOKEN" \
     "https://n8n.pbradygeorgen.com/api/v1/workflows" | jq

# Test webhook endpoint
curl -X POST -F "resume=@test.txt" \
     "https://n8n.pbradygeorgen.com/webhook/resume-audit" -v
```

## 🔄 Updates & Maintenance

### **Workflow Updates**

1. **Export Current Workflow** from n8n
2. **Modify** the exported JSON file
3. **Re-import** the updated workflow
4. **Test** with sample resumes
5. **Activate** the new version

### **Version Control**

```bash
# Commit workflow changes
git add workflows/resume-compliance-auditor.json
git commit -m "Update resume auditor workflow v2.0"
git push origin main

# Tag releases
git tag -a v2.0.0 -m "Resume Auditor v2.0.0"
git push origin v2.0.0
```

## 📞 Support & Community

### **Getting Help**

- **n8n Documentation**: [docs.n8n.io](https://docs.n8n.io)
- **n8n Community**: [community.n8n.io](https://community.n8n.io)
- **GitHub Issues**: Report bugs and feature requests

### **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🎯 Next Steps

### **Immediate Actions**

1. ✅ Deploy the workflow to n8n.pbradygeorgen.com
2. ✅ Test with sample resumes
3. ✅ Deploy the public HTML interface
4. ✅ Share with your team/users

### **Future Enhancements**

- **AI-Powered Suggestions**: Integrate with GPT models for personalized advice
- **Resume Templates**: Provide industry-specific templates
- **Performance Analytics**: Track user engagement and success rates
- **Multi-language Support**: Add international resume formats
- **Integration APIs**: Connect with job boards and ATS systems

---

## 🚀 **Ready to Deploy?**

Your Resume Compliance Auditor is ready to revolutionize resume analysis! 

**Deploy now with:**
```bash
./scripts/deploy-resume-auditor.sh
```

**Live long and prosper! 🖖**
