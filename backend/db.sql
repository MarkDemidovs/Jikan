-- Accounts table: stores user login info
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- store hashed passwords only
    created_at TIMESTAMP DEFAULT NOW()
);

-- Teams table: each team has a unique name
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Team members: join table for many-to-many accounts <-> teams
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    account_id INT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    UNIQUE(team_id, account_id) -- prevent duplicates
);

-- Events table: linked to teams
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    event_info VARCHAR(255), -- description, capped at 255 chars
    created_at TIMESTAMP DEFAULT NOW()
);
