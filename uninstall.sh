#!/bin/bash

# Function to print colored log messages
log_message() {
  local message="$1"
  local color="$2"
  echo -e "\033[${color}mTzuOS -> $message\033[0m"
}

# Function to stop and disable systemd service
remove_systemd_service() {
  log_message "Stopping and disabling TzuOS service..." "34" # Cyan for this step
  systemctl stop tzuos.service > /dev/null 2>&1
  systemctl disable tzuos.service > /dev/null 2>&1
  if [[ $? -eq 0 ]]; then
    log_message "Successfully stopped and disabled TzuOS service." "32" # Green for success
    rm -f /etc/systemd/system/tzuos.service > /dev/null 2>&1
    systemctl daemon-reload > /dev/null 2>&1
    log_message "Successfully removed TzuOS service." "32"
  else
    log_message "Error: Failed to stop or disable TzuOS service." "31" # Red for error
    exit 1
  fi
}

# Function to remove the TzuOS directory
remove_tzuos_directory() {
  log_message "Removing TzuOS directory..." "34" # Cyan for this step
  INSTALL_DIR=$(dirname "$(pwd)")/tzuos

  if [ -d "$INSTALL_DIR" ]; then
    rm -rf "$INSTALL_DIR" > /dev/null 2>&1
    if [[ $? -eq 0 ]]; then
      log_message "Successfully removed TzuOS directory." "32" # Green for success
    else
      log_message "Error: Failed to remove TzuOS directory." "31" # Red for error
      exit 1
    fi
  else
    log_message "TzuOS directory does not exist." "33" # Yellow for warning
  fi
}

# Main script
log_message "1/3 Stopping and disabling service..." "34"
remove_systemd_service

log_message "2/3 Removing TzuOS directory..." "34"
remove_tzuos_directory

log_message "3/3 TzuOS has been uninstalled successfully." "32" # Green for completion
