-- Brings an existing local database in sync with schema.sql after removing the
-- live-chat and wallet features. Run once: mysql -u root -p myastroreader < server/migrations/001_remove_chat_and_wallet.sql
USE myastroreader;

DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_sessions;
DROP TABLE IF EXISTS wallet_transactions;

ALTER TABLE users DROP COLUMN wallet_balance_paise;
ALTER TABLE astrologers DROP COLUMN chat_rate_paise_per_min;
