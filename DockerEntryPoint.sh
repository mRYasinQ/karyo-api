#!/bin/sh

echo "Migrating database..."
node ./node_modules/@mikro-orm/cli/cli.js migration:up

echo

echo "Starting app..."
exec node dist/main.js
