# Eliftech PERN API Boilerplate

## Overview

This is a boilerplate application for building REST APIs in Node.js using ES6 and Express. Intended for use with Postgres using Sequelize ORM.

## Getting Started

Install dependencies:
```sh
npm i
```
Set environment (vars):
```sh
cp .env.example .env
```

Start server:
```sh
# Start server
npm run dev
```

Install nodemon and sequelize-cli
```sh
npm install -g nodemon
npm install -g sequelize-cli
```

Create database
```sh
sudo su postgres
psql
CREATE DATABASE db_name
```

## Sequelize

Create Migration
```sh
sequelize model:create --name Test --attributes title:string,price:string,description:string
```

Migrate all migrations
```sh
sequelize db:migrate
```

Revert all migrations
```sh
sequelize db:migrate:undo
```