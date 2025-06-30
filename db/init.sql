CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    house_id INT,
    country VARCHAR(50),
    city VARCHAR(50)
);

CREATE TABLE devices (
    device_id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(location_id),
    installed_at VARCHAR(100)
);

CREATE TABLE alarm_types (
    alarm_type_id SERIAL PRIMARY KEY,
    alarm_type VARCHAR(50),
    sensor_source VARCHAR(50),
    trigger_condition VARCHAR(50),
    severity VARCHAR(50)
);

CREATE TABLE alarms (
    alarm_id SERIAL PRIMARY KEY,
    device_id INT REFERENCES devices(device_id),
    alarm_type_id INT REFERENCES alarm_types(alarm_type_id),
    value FLOAT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sensor_readings (
    id SERIAL PRIMARY KEY,
    device_id INT REFERENCES devices(device_id),
    co2 FLOAT,
    gas FLOAT,
    smoke FLOAT,
    temperature FLOAT,
    battery_level FLOAT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO locations (house_id, country, city) VALUES
(1001, 'Germany', 'Berlin'),
(1002, 'Italy', 'Rome'),
(1003, 'France', 'Paris'),
(103, 'Italy', 'Milan'),
(105, 'France', 'Lyon'),
(107, 'Germany', 'Munich'),
(108, 'Spain', 'Madrid'),
(109, 'Spain', 'Barcelona'),
(110, 'USA', 'New York');

INSERT INTO devices (location_id, installed_at) VALUES
(1, '2024-01-01'),
(2, '2024-01-15'),
(3, '2024-02-01'),
(4, '2024-02-10'),
(5, '2024-03-01'),
(6, '2024-03-15'),
(7, '2024-04-01'),
(8, '2024-06-02'),
(9, '2024-01-10'),
(4, '2024-02-15'),
(2, '2024-03-20');

INSERT INTO alarm_types (alarm_type, sensor_source, trigger_condition, severity) VALUES
('CO2_HIGH', 'CO₂ sensor', 'CO₂ > 1000 ppm', 'Medium'),
('CO2_CRITICAL', 'CO₂ sensor', 'CO₂ > 2000 ppm', 'High'),
('GAS_LEAK', 'Gas sensor', 'Gas level > 75 ppm', 'High'),
('GAS_CRITICAL', 'Gas sensor', 'Gas level > 150 ppm', 'Very High'),
('TEMP_HIGH', 'Temp sensor', 'Temp > 50°C', 'Medium'),
('TEMP_CRITICAL', 'Temp sensor', 'Temp > 70°C', 'High'),
('SMOKE_DETECTED', 'Smoke sensor', 'Smoke > 30% or density > X', 'Medium'),
('SMOKE_HIGH', 'Smoke sensor', 'Smoke > 60%', 'High'),
('MULTI_SENSOR_ALERT', 'Multiple sensors', 'More than 2 alarms at once', 'Critical');

