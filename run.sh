#!/bin/bash

params=" -u ${DB_ENV_MYSQL_USER} -p${DB_ENV_MYSQL_PASS} -h ${DB_PORT_3306_TCP_ADDR} "

echo 'HELLO!'
echo "${params}";

# Create Database
mysql $params <<DELIMITER
CREATE DATABASE IF NOT EXISTS code_friends;
CREATE DATABASE IF NOT EXISTS code_friends_test;
DELIMITER

# Check if it exists
mysql $params <<DELIMITER
SHOW DATABASES;
DELIMITER

node /app/server