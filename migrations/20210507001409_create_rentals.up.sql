-- Each rental transaction/checkout
CREATE TABLE rentals (
    -- Rental ID
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,

    -- User ID, foreign key to user table
    -- User that rented the bike.
    user_id INT UNSIGNED NOT NULL,

    -- Bike ID, foreign key to inventory table
    bike_id INT UNSIGNED NOT NULL,

    -- Duration of the rental in seconds.
    duration INT UNSIGNED NOT NULL,

    -- Time it in which the rental started
    rental_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Time it in which rental was returned/completed.
    -- Null if never returned.
    rental_end TIMESTAMP NULL,

    FOREIGN KEY (`user_id`) REFERENCES users(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`bike_id`) REFERENCES inventory(`id`) ON DELETE CASCADE,

    PRIMARY KEY(`id`),
    INDEX(`rental_start`),
    INDEX(`rental_end`)
);