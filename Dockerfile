# 🖖 AlexAI Star Trek Agile System - Docker Configuration
# Multi-stage build for optimized production deployment

# Stage 1: Build stage
FROM python:3.9-slim as builder

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Production stage
FROM python:3.9-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV FLASK_ENV=production
ENV FLASK_APP=main.py

# Create non-root user
RUN groupadd -r alexai && useradd -r -g alexai alexai

# Set working directory
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder stage
COPY --from=builder /root/.local /home/alexai/.local

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/logs /app/data && \
    chown -R alexai:alexai /app

# Switch to non-root user
USER alexai

# Add local bin to PATH
ENV PATH=/home/alexai/.local/bin:$PATH

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/alexai/status || exit 1

# Start the application
CMD ["python", "main.py"] 