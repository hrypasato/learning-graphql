CREATE SCHEMA azdev;

--User model table
CREATE TABLE azdev.users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    hashed_auth_token TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
    CHECK (lower(username) = username)
);

--Task table
CREATE TABLE azdev.tasks(
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    tags TEXT,
    user_id INTEGER NOT NULL,
    is_private NOT NULL DEFAULT FALSE,
    approach_count INTEGER NOT NULL DEFAULT 0, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
    FOREIGN KEY (user_id) REFERENCES azdev.users
);

--Approaches table
CREATE TABLE azdev.approaches(
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    task_id INTEGER NOT NULL,
    vote_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
    FOREIGN KEY (user_id) REFERENCES azdev.users,
    FOREIGN KEY (task_id) REFERENCES azdev.tasks
)