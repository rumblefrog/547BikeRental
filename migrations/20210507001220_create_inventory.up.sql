CREATE TABLE inventory (
    -- Bike inventory ID
    id INT UNSIGNED NOT NULL,

    public_key TEXT NOT NULL,

    cost INT UNSIGNED NOT NULL,

    missing TINYINT(1) NOT NULL DEFAULT 0,

    -- Model of the bike, color, size
    description TEXT NOT NULL,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(`id`)
);