#!/usr/bin/env bash
# ==============================================================================
# FoundrAI EC2 Deployment & Update Script
# Target EC2 IP: 16.112.146.157
# Target URL: http://16.112.146.157
# ==============================================================================

set -e

echo "🚀 Starting FoundrAI Deployment on AWS EC2..."

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

# 1. Update packages & install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt-get update -y
    sudo apt-get install -y nginx curl
fi

# 2. Setup Backend Virtual Environment & Dependencies
echo "🐍 Setting up Backend..."
cd "$BACKEND_DIR"

if [ ! -d ".venv" ]; then
    echo "Creating python3 venv..."
    python3 -m venv .venv
fi

source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Ensure directories exist
mkdir -p app/chroma_db app/uploads/pdf

# 3. Create or Update Systemd Service for Backend
echo "⚙️ Configuring Systemd Service for Backend..."
BACKEND_SERVICE="/etc/systemd/system/foundrai-backend.service"
CURRENT_USER="$(whoami)"

sudo bash -c "cat <<EOF > $BACKEND_SERVICE
[Unit]
Description=FoundrAI FastAPI Backend
After=network.target

[Service]
User=$CURRENT_USER
WorkingDirectory=$BACKEND_DIR
ExecStart=$BACKEND_DIR/.venv/bin/python run.py
Restart=always
RestartSec=5
Environment=PORT=8000
Environment=HOST=0.0.0.0
EnvironmentFile=-$BACKEND_DIR/.env

[Install]
WantedBy=multi-user.target
EOF"

sudo systemctl daemon-reload
sudo systemctl enable foundrai-backend
sudo systemctl restart foundrai-backend

# 4. Build Frontend
echo "⚛️ Building Frontend..."
cd "$FRONTEND_DIR"

if ! command -v npm &> /dev/null; then
    echo "📦 Installing Node.js & npm..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

npm ci || npm install
npm run build

# 5. Deploy Frontend to /var/www/html
echo "📂 Deploying Frontend build to /var/www/html..."
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# 6. Configure Nginx
echo "🌐 Configuring Nginx Reverse Proxy..."
if [ -f "$APP_DIR/nginx_ec2.conf" ]; then
    sudo cp "$APP_DIR/nginx_ec2.conf" /etc/nginx/sites-available/default
fi

sudo nginx -t
sudo systemctl restart nginx

# 7. Health Check
echo "🔍 Verifying Deployment..."
sleep 3
HEALTH_STATUS=$(curl -s http://127.0.0.1/api/health/ || echo "Failed")

echo "=========================================================="
echo "🎉 Deployment completed successfully!"
echo "📡 Backend Health: $HEALTH_STATUS"
echo "🌐 Access your app at: http://16.112.146.157"
echo "=========================================================="
