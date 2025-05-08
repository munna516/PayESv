# PostgreSQL Database Setup for PAYESV

This document explains how to set up and configure the PostgreSQL database for the PAYESV application.

## Prerequisites

1. Install PostgreSQL on your system if you haven't already:
   - [Download PostgreSQL](https://www.postgresql.org/download/)
   - Follow the installation instructions for your operating system

## Database Setup

1. Create a new PostgreSQL database:

```bash
# Log into PostgreSQL as the postgres user
psql -U postgres

# Create the database
CREATE DATABASE payesv;

# Connect to the new database
\c payesv
```

2. Run the schema.sql script to create the necessary tables:

```bash
# From the project root, run:
psql -U postgres -d payesv -f src/lib/schema.sql
```

## Environment Configuration

Create a `.env.local` file in the project root with the following variables:

```
# Database configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=payesv
DB_PASSWORD=your_password_here
DB_PORT=5432

# Next Auth
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

Make sure to replace `your_password_here` with your actual PostgreSQL password and generate a strong random string for `NEXTAUTH_SECRET`.

## Verify Connection

Start the application with `npm run dev`. If the database connection is successful, you should see the message "Connected to PostgreSQL database" in the console.

## Troubleshooting

If you encounter connection issues:

1. Verify that PostgreSQL service is running
2. Check your database credentials in the `.env.local` file
3. Make sure your PostgreSQL server accepts connections from localhost
4. Check the database logs for any error messages
