#!/bin/sh

echo "Migrating database..."
pnpm db:up

echo

echo "Starting app..."
exec pnpm start:prod
