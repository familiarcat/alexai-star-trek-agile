# 🚀 Manual AWS Deployment Guide for AlexAI Enterprise Platform

## Overview
This guide provides step-by-step instructions to manually deploy the AlexAI Enterprise Platform to AWS with cost optimization.

## Prerequisites
- AWS CLI installed and configured
- AWS account with appropriate permissions
- Domain: `pbradygeorgen.com` (already configured)

## Step 1: Create EC2 Instance

### 1.1 Launch Instance via AWS Console
1. Go to AWS EC2 Console
2. Click "Launch Instance"
3. Configure:
   - **Name**: `alexai-consolidated`
   - **AMI**: Ubuntu Server 22.04 LTS (ami-0c02fb55956c7d316)
   - **Instance Type**: `t3.medium` (2 vCPU, 4 GB RAM)
   - **Key Pair**: Create or select existing key pair
   - **Security Group**: Create new with rules:
     - SSH (22): 0.0.0.0/0
     - HTTP (80): 0.0.0.0/0
     - HTTPS (443): 0.0.0.0/0
     - Custom (3000): 0.0.0.0/0 (Dashboard)
     - Custom (5678): 0.0.0.0/0 (n8n)
   - **Storage**: 20 GB GP3

### 1.2 Instance Details
- **Public IP**: [Will be assigned]
- **Instance ID**: [Will be assigned]
- **Estimated Cost**: $50-80/month

## Step 2: Configure DNS (Route 53)

### 2.1 Create A Records
In Route 53, create A records for:
- `dashboard.pbradygeorgen.com` → [EC2 Public IP]
- `agile.pbradygeorgen.com` → [EC2 Public IP]
- `software.pbradygeorgen.com` → [EC2 Public IP]
- `business.pbradygeorgen.com` → [EC2 Public IP]
- `startup.pbradygeorgen.com` → [EC2 Public IP]
- `n8n.pbradygeorgen.com` → [EC2 Public IP]

## Step 3: Deploy Applications

### 3.1 SSH to Instance
```bash
ssh -i your-key.pem ubuntu@[EC2-PUBLIC-IP]
```

### 3.2 Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python
sudo apt install -y python3 python3-pip python3-venv

# Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3.3 Clone Repository
```bash
git clone https://github.com/familiarcat/alexai-star-trek-agile.git
cd alexai-star-trek-agile
```

### 3.4 Deploy with Docker Compose
```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

## Step 4: Configure Nginx

### 4.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/alexai
```

Add the following configuration:
```nginx
# Dashboard
server {
    listen 80;
    server_name dashboard.pbradygeorgen.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Agile
server {
    listen 80;
    server_name agile.pbradygeorgen.com;
    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Software
server {
    listen 80;
    server_name software.pbradygeorgen.com;
    location / {
        proxy_pass http://localhost:8002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Business
server {
    listen 80;
    server_name business.pbradygeorgen.com;
    location / {
        proxy_pass http://localhost:8003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Startup
server {
    listen 80;
    server_name startup.pbradygeorgen.com;
    location / {
        proxy_pass http://localhost:8004;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# n8n
server {
    listen 80;
    server_name n8n.pbradygeorgen.com;
    location / {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4.2 Enable Site
```bash
sudo ln -sf /etc/nginx/sites-available/alexai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: SSL Certificates

### 5.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 5.2 Generate Certificates
```bash
sudo certbot --nginx -d dashboard.pbradygeorgen.com
sudo certbot --nginx -d agile.pbradygeorgen.com
sudo certbot --nginx -d software.pbradygeorgen.com
sudo certbot --nginx -d business.pbradygeorgen.com
sudo certbot --nginx -d startup.pbradygeorgen.com
sudo certbot --nginx -d n8n.pbradygeorgen.com
```

## Step 6: Monitoring Setup

### 6.1 Install Prometheus & Grafana
```bash
# Create monitoring directory
mkdir -p /opt/monitoring
cd /opt/monitoring

# Download Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz
tar -xzf prometheus-2.45.0.linux-amd64.tar.gz
cd prometheus-2.45.0.linux-amd64

# Create Prometheus config
cat > prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'alexai-services'
    static_configs:
      - targets: ['localhost:3000', 'localhost:8001', 'localhost:8002', 'localhost:8003', 'localhost:8004', 'localhost:5678']
EOF

# Start Prometheus
./prometheus --config.file=prometheus.yml &
```

## Step 7: Cost Optimization

### 7.1 Current Costs
- **EC2 t3.medium**: ~$30/month
- **Data Transfer**: ~$10/month
- **Route 53**: ~$1/month
- **Total**: ~$41/month

### 7.2 Optimization Strategies
1. **Reserved Instances**: Save 30-60% with 1-3 year commitments
2. **Spot Instances**: Use for non-critical workloads
3. **Auto Scaling**: Scale down during low usage
4. **CloudWatch**: Monitor and optimize resource usage

## Step 8: Testing

### 8.1 Test URLs
- Dashboard: https://dashboard.pbradygeorgen.com
- Agile: https://agile.pbradygeorgen.com
- Software: https://software.pbradygeorgen.com
- Business: https://business.pbradygeorgen.com
- Startup: https://startup.pbradygeorgen.com
- n8n: https://n8n.pbradygeorgen.com

### 8.2 Health Checks
```bash
# Check services
curl -I https://dashboard.pbradygeorgen.com
curl -I https://agile.pbradygeorgen.com
curl -I https://software.pbradygeorgen.com

# Check Docker containers
docker-compose ps

# Check logs
docker-compose logs -f
```

## Success Metrics
- ✅ All subdomains accessible
- ✅ SSL certificates working
- ✅ Services responding
- ✅ Cost under $50/month
- ✅ Monitoring active

## Next Steps
1. Set up automated backups
2. Configure CloudWatch alerts
3. Implement CI/CD pipeline
4. Add load balancing for high availability

---
**Live long and prosper! 🖖** 