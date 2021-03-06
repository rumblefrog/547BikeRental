CREATE TABLE users (
    -- User ID
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,

    username VARCHAR(64) NOT NULL UNIQUE,

    email VARCHAR(255) NOT NULL UNIQUE,

    -- Blowfish cipher is 64-bit key size
    password VARCHAR(128) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(`id`),
    INDEX(`username`)
);