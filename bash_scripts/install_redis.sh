#!/bin/bash

# Update apt-get package index
sudo apt-get update

# Install Redis
sudo apt-get install -y redis-server

# Start Redis service
sudo redis-server