#!/bin/bash
docker compose down
docker volume rm -f large-files-importer_mongo_db_importer_api
docker compose up -d
npm run dev
