-- Brings an existing local database in sync with schema.sql after removing the
-- "Request Callback" feature. Run once: mysql -u root -p myastroreader < server/migrations/002_remove_callback_requests.sql
USE myastroreader;

DROP TABLE IF EXISTS callback_requests;
