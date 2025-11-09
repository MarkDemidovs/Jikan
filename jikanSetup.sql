-- Create database
CREATE DATABASE jikan;

-- Connect to jikan database
\c jikan

-- Accounts table
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Team members join table
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    account_id INT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    UNIQUE(team_id, account_id)
);

-- Events table (with TIMESTAMP for date + time)
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    event_date TIMESTAMP NOT NULL,  -- changed from DATE to TIMESTAMP
    event_name VARCHAR(100) NOT NULL,
    event_info VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert dummy accounts
INSERT INTO accounts (username, password_hash)
VALUES
('alice', 'hashed_password_1'),
('bob', 'hashed_password_2'),
('carol', 'hashed_password_3');

-- Insert dummy teams
INSERT INTO teams (team_name)
VALUES
('Team Rocket'),
('Team Alpha'),
('Team Beta');

-- Insert dummy team members
INSERT INTO team_members (team_id, account_id)
VALUES
(1, 1), -- Alice in Team Rocket
(1, 2), -- Bob in Team Rocket
(2, 2), -- Bob in Team Alpha
(3, 3); -- Carol in Team Beta

-- Insert dummy events with time included
INSERT INTO events (team_id, event_date, event_name, event_info)
VALUES
(1, '2025-11-01 09:00', 'Rocket Launch', 'Rocket launch event for Team Rocket'),
(2, '2025-11-05 14:30', 'Alpha Meetup', 'Team Alpha meetup and strategy session'),
(3, '2025-11-10 10:00', 'Beta Hackathon', 'Team Beta hackathon event');
