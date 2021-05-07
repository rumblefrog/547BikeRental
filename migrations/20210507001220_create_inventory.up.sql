CREATE TABLE inventory (
    -- Bike inventory ID
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,

    cost INT UNSIGNED NOT NULL,

    missing TINYINT(1) NOT NULL DEFAULT 0,

    -- Model of the bike, color, size
    description TEXT NOT NULL,
    
    creation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(`id`)
);