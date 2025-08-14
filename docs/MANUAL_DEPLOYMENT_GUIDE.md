# 🚀 **Manual Deployment Guide - Resume Compliance Auditor**

## 🔍 **Current Status**

Your automated deployment is blocked because:
- ✅ **Credentials configured** in `~/.zshrc`
- ✅ **Deployment package ready** in `ec2-deployment/`
- ❌ **SSH connection blocked** (port 22 timeout)

## 🛠️ **Manual Deployment Steps**

### **Step 1: Verify EC2 Instance**

#### **Check AWS Console**
1. **Open**: [AWS EC2 Console](https://console.aws.amazon.com/ec2/)
2. **Verify**: Your instance is running
3. **Check**: Security group allows SSH (port 22)
4. **Note**: Public IP address

#### **Common Issues & Fixes**
```bash
# If instance is stopped
aws ec2 start-instances --instance-ids your-instance-id

# If security group blocks SSH
# Add rule: Type: SSH, Port: 22, Source: 0.0.0.0/0 (or your IP)
```

### **Step 2: Manual File Upload**

#### **Option A: AWS Console Upload**
1. **Connect** via AWS Systems Manager (if SSH blocked)
2. **Upload files** manually through console
3. **Run deployment commands** directly on instance

#### **Option B: Alternative SSH Port**
If SSH is on a different port:
```bash
# Update your ~/.zshrc
export EC2_SSH_PORT="2222"  # or whatever port you use

# Test connection
ssh -i "$EC2_KEY_PATH" -p "$EC2_SSH_PORT" "$EC2_USER@$EC2_HOST"
```

#### **Option C: Web-based Upload**
1. **Set up** a temporary web server on EC2
2. **Upload files** via HTTP/HTTPS
3. **Download** and deploy locally on EC2

### **Step 3: Deploy on EC2 Instance**

#### **Files to Upload**
```bash
# These files are ready in ec2-deployment/
resume-auditor.html
resume-compliance-auditor.json
nginx-resume-auditor.conf
deploy-on-ec2.sh
RESUME_AUDITOR_DEPLOYMENT.md
```

#### **Manual Deployment Commands**
```bash
# On your EC2 instance, run:
sudo apt-get update
sudo apt-get install -y nginx

# Create web directory
sudo mkdir -p /var/www/resume-auditor
sudo chown ubuntu:ubuntu /var/www/resume-auditor

# Copy files (adjust paths as needed)
cp resume-auditor.html /var/www/resume-auditor/
cp resume-compliance-auditor.json /var/www/resume-auditor/

# Set permissions
sudo chown -R www-data:www-data /var/www/resume-auditor
sudo chmod -R 755 /var/www/resume-auditor

# Configure nginx
sudo cp nginx-resume-auditor.conf /etc/nginx/sites-available/resume-auditor
sudo ln -sf /etc/nginx/sites-available/resume-auditor /etc/nginx/sites-enabled/

# Test and reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

### **Step 4: Test Deployment**

#### **Verify Access**
```bash
# Test from EC2 instance
curl http://localhost/resume-auditor.html

# Test from your local machine
curl http://your-ec2-public-ip/resume-auditor.html
```

#### **Check nginx Status**
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## 🔧 **Troubleshooting SSH Issues**

### **Check Instance Status**
```bash
# From AWS CLI (if configured)
aws ec2 describe-instances --instance-ids your-instance-id

# Check instance state and public IP
```

### **Verify Security Group**
```bash
# Check if port 22 is open
nmap -p 22 your-ec2-public-ip

# Or use telnet
telnet your-ec2-public-ip 22
```

### **Alternative Connection Methods**
```bash
# Try AWS Systems Manager
aws ssm start-session --target your-instance-id

# Or use AWS CloudShell
# Upload files via S3, then download on instance
```

## 📱 **Quick Test Deployment**

### **Local Testing (While Fixing SSH)**
```bash
# Test the HTML interface locally
cd ec2-deployment
python3 -m http.server 8080

# Access at: http://localhost:8080/resume-auditor.html
# This will still have CORS issues, but you can test the UI
```

### **n8n Workflow Setup**
1. **Open**: https://n8n.pbradygeorgen.com
2. **Import**: `resume-compliance-auditor.json`
3. **Activate**: The workflow
4. **Test**: Webhook endpoint

## 🎯 **Next Steps**

### **Immediate Actions**
1. **Check EC2 instance** in AWS Console
2. **Verify security group** allows SSH (port 22)
3. **Confirm public IP** is correct
4. **Try alternative connection** methods

### **Once Connected**
1. **Upload deployment package**
2. **Run deployment script**
3. **Test Resume Auditor**
4. **Verify no CORS issues**

## 🔐 **Security Notes**

### **Current Status**
- ✅ **Credentials secure** in `~/.zshrc`
- ✅ **Key file protected** (400 permissions)
- ✅ **No secrets exposed** in scripts
- ✅ **Backup created** of `~/.zshrc`

### **Manual Deployment Security**
- **Use HTTPS** for file uploads if possible
- **Verify file integrity** after upload
- **Check nginx configuration** for security
- **Monitor access logs** for unusual activity

## 🚀 **Alternative Deployment Options**

### **Option 1: Fix SSH Issues**
- **Start EC2 instance** if stopped
- **Update security group** to allow SSH
- **Verify IP/domain** is correct

### **Option 2: Use AWS Systems Manager**
- **No SSH required**
- **Secure connection** via AWS
- **File upload** via S3

### **Option 3: Web-based Deployment**
- **Temporary web server** on EC2
- **File upload** via HTTP
- **Secure deployment** process

## 🎉 **You're Almost There!**

Your Resume Compliance Auditor is:
- ✅ **Fully configured** and ready
- ✅ **Securely packaged** for deployment
- ✅ **Production-ready** with nginx
- ✅ **CORS-free** when deployed

**Just need to resolve the SSH connection to complete deployment! 🖖**

## 📞 **Need Help?**

### **Common SSH Issues**
1. **Instance stopped** → Start in AWS Console
2. **Security group** → Add SSH rule (port 22)
3. **Wrong IP** → Check public IP in AWS Console
4. **Key pair mismatch** → Verify key file name

### **Quick Commands**
```bash
# Check credentials
echo "EC2_HOST: $EC2_HOST"
echo "EC2_KEY_PATH: $EC2_KEY_PATH"

# Test connection (if port 22 opens)
ssh -i "$EC2_KEY_PATH" "$EC2_USER@$EC2_HOST"

# Check deployment package
ls -la ec2-deployment/
```
