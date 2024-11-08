#!/bin/bash

# Function to print colored log messages
log_message() {
  local message="$1"
  local color="$2"
  echo -e "\033[${color}mTzuOS -> $message\033[0m"
}

# Function to check Node.js version
check_nodejs() {
  log_message "1/6 Checking nodejs..." "34" # Cyan for this step
  node_version=$(node -v | cut -d. -f1 | sed 's/[^0-9]*//g' 2>/dev/null)
  if [[ "$node_version" -ge 20 ]]; then
    log_message "Node.js is installed and version is >= v20." "32" # Green for success
  else
    log_message "Node.js is not installed or version is lower than v20. Installing Node.js..." "33" # Yellow for warning
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
    apt-get install -y nodejs > /dev/null 2>&1
    if [[ $? -eq 0 ]]; then
      log_message "Node.js successfully installed." "32"
    else
      log_message "Error: Failed to install Node.js." "31" # Red for error
      exit 1
    fi
  fi
}

# Function to clone TzuOS repository
clone_repo() {
  log_message "2/6 Clone TzuOS..." "34"
  if [ -d "$INSTALL_DIR" ]; then
    log_message "Directory tzuos already exists, skipping git clone." "33" # Yellow for warning
  else
    git clone https://github.com/ge0rg3e/tzuos.git "$INSTALL_DIR" > /dev/null 2>&1
    if [[ $? -eq 0 ]]; then
      log_message "Finished cloning repository." "32"
    else
      log_message "Error: Failed to clone repository." "31"
      exit 1
    fi
  fi
}

# Function to generate a random JWT_SECRET
generate_jwt_secret() {
  JWT_SECRET=$(openssl rand -base64 32)
  echo "$JWT_SECRET"
}

# Function to create .env file with JWT_SECRET
create_env_file() {
  log_message "3/6 Create .env file..." "34"
  JWT_SECRET=$(generate_jwt_secret)
  echo "JWT_SECRET=$JWT_SECRET" > "$INSTALL_DIR/.env"
  if [[ $? -eq 0 ]]; then
    log_message "Successfully created .env file with JWT_SECRET." "32"
  else
    log_message "Error: Failed to create .env file." "31"
    exit 1
  fi
}

# Function to install dependencies, migrate the database, and build the project
install_dependencies() {
  log_message "4/6 Install Dependencies..." "34"
  if [ -d "$INSTALL_DIR" ]; then
    cd "$INSTALL_DIR" || exit
    npm install --force > /dev/null 2>&1
    if [[ $? -eq 0 ]]; then
      log_message "Successfully installed dependencies." "32"
    else
      log_message "Error: Failed to install dependencies." "31"
      exit 1
    fi

    log_message "5/6 Setup database..." "34"
    npx prisma migrate dev --name init > /dev/null 2>&1
    if [[ $? -eq 0 ]]; then
      log_message "Successfully setup database." "32"
    else
      log_message "Error: Failed to setup database." "31"
      exit 1
    fi

    log_message "6/6 Build Project..." "34"
    npm run build > /dev/null 2>&1
    if [[ $? -eq 0 ]]; then
      log_message "Build successful." "32"
    else
      log_message "Error: Failed to build project." "31"
      exit 1
    fi
  else
    log_message "Error: Directory $INSTALL_DIR not found!" "31"
    exit 1
  fi
}

# Function to set up systemd service for TzuOS
setup_systemd_service() {
  log_message "7/6 Create service..." "34"
  SERVICE_NAME="tzuos.service"
  SERVICE_PATH="/etc/systemd/system/$SERVICE_NAME"

  cat <<EOF > $SERVICE_PATH
[Unit]
Description=TzuOS Service
After=network.target

[Service]
ExecStart=/usr/bin/npm run start -- --port 61041
WorkingDirectory=$INSTALL_DIR
Restart=always
RestartSec=5
User=root
Group=root

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload > /dev/null 2>&1
  systemctl enable $SERVICE_NAME > /dev/null 2>&1
  systemctl start $SERVICE_NAME > /dev/null 2>&1

  if [[ $? -eq 0 ]]; then
    log_message "Successfully created service." "32"
  else
    log_message "Error: Failed to create service." "31"
    exit 1
  fi
}

# Function to run the TzuOS application
run_tzuos() {
  log_message "TzuOS is now running..." "34"
  # Retrieve the first non-loopback IP address of the machine
  IP_ADDRESS=$(hostname -I | awk '{print $1}')
  echo -e "\033[32mTzuOS -> 6/6 Run the TzuOS - Access at http://$IP_ADDRESS:61041\033[0m"
}

# Main script
if [[ $(id -u) -eq 0 ]]; then
  INSTALL_DIR="/root/tzuos"
else
  INSTALL_DIR="/home/$USER/tzuos"
fi

check_nodejs
clone_repo
create_env_file
install_dependencies
setup_systemd_service
run_tzuos

log_message "TzuOS installation is complete and the service is running." "32"
