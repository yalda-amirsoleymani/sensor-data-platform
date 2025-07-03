Project description:

The company makes smart gas, smoke, CO₂, and temperature sensors. These sensors are installed in houses in different locations, and they send data constantly.
    • Data is received by the backend via MQTT (For the publishing and subscribing we’ll use Python paho-mqtt library, For the broker we’ll use Docker Mosquitto)
    • If the values go above a certain level, it triggers an alarm
    • Everything is saved to a relational database

Key parts of the project:

Sensor Simulation:
Simulate sensors using a simple Python script that sends data to the backend using MQTT.
Database Layer
    • PostgreSQL on local dev environment.(We’ll use docker to run PostgreSQL locally)
    • Later for production, move to:
        ◦ Amazon RDS (for PostgreSQL)
Dockerization
    • Create Dockerfile for API.
    • Use docker-compose for local dev to run API + DB.
    • Push images to Docker Hub or AWS ECR.
CI/CD Pipeline
Use GitHub Actions:
    • On push to main, build and test.
    • On tag/release, build Docker image and push to AWS (or Docker Hub).
    • (Optional) Deploy to EC2 or ECS automatically.
Analytics and Alerts
    • Set thresholds for CO2 > X, trigger alert via:
        ◦ Email, Webhook, or Slack.
        ◦ Use AWS SNS or Lambda for alerts.
    • Build a dashboard (Optional, very last step)

Core Tables:
1- locations
| Column        | Type      | Description      |
|---------------|-----------|----------------- |
| location_id   | INT (PK)  | Unique location  |
| house_id      | TEXT      | Unique house code|
| city          | TEXT      | City name        |
| country       | TEXT      | Country name     |

2- devices
| Column        | Type      | Description      |
|---------------|-----------|----------------- |
| device_id     | TEXT (PK) | Unique sensor board          |
| location_id   | TEXT      | Where the board is installed |
| installed_at  | TEXT      | When the board was installed |

3- sensor_readings
| Column        | Type       | Description                 |
|---------------|------------|--------------------------   |
| reading_id    | SERIAL (PK)| Autoincrement ID            |
| device_id     | FK         | Which board sent this data  |
| timestamp     | TIMESTAMP  | When the reading happened   |
| co2_level     | FLOAT      | CO₂ in ppm                  |
| smoke_level   | FLOAT      | Smoke %, or ppm             |
| gas_level     | FLOAT      | Gas measurement             |
| temperature   | FLOAT      | In Celsius                  |
| battery_level | FLOAT      | In percentage               |
| installed_at  | FLOAT      | When the board was installed|


4- alarm_types
| Column             | Trigger Condition   | Description                 |
|--------------------|---------------------|--------------------------   |
| CO2_HIGH           | CO₂ > 1000 ppm      | Autoincrement ID            |
| CO2_CRITICAL       | CO₂ > 2000 ppm      | Which board sent this data  |
| GAS_LEAK           | Gas level > 75 ppm  | When the reading happened   |
| GAS_CRITICAL       | Gas level > 150 ppm | CO₂ in ppm                  |
| TEMP_HIGH          | Temp > 50°C         | Smoke %, or ppm             |
| TEMP_CRITICAL      | Temp > 70°C         | Gas measurement             |
| SMOKE_DETECTED     | Smoke > 30%         | In Celsius                  |
| SMOKE_HIGH         | Smoke > 60%         | In percentage               |
| MULTI_SENSOR_ALERT | More than 2 alarms  | When the board was installed|
5- alarms
| Column        | Type       | Description                   |
|---------------|------------|------------------------------ |
| alarm_id      | SERIAL (PK)| Unique alarm                  |
| device_id     | FK         | Which board triggered it      |
| timestamp     | TIMESTAMP  | When it was triggered         |
| alarm_type    | FLOAT      | Type (CO₂, smoke, etc.)       |
| value         | FLOAT      | Actual value that caused alarm|
| status        | FLOAT      | "high", "resolved", etc.      |


API Endpoint Design:

| Method | Endpoint                               | Description               |
| ------ | -------------------------------------- | ------------------------- |
| GET    | `/health`                              | Health check              |
| GET    | `/locations`                           | List all locations        |
| GET    | `/locations/:location_id`              | One location              |
| GET    | `/locations/:location_id/devices`      | Devices at location       |
| GET    | `/devices`                             | All devices               |
| GET    | `/devices/:device_id`                  | One device                |
| GET    | `/readings/latest?limit=15`            | Latest readings           |
| GET    | `/devices/:device_id/readings`         | Readings by device        |
| GET    | `/readings?start=&end=&limit=&offset=` | Filtered readings         |
| GET    | `/alarms`                              | All alarms                |
| GET    | `/alarms?status=active`                | Alarms filtered by status |
| GET    | `/devices/:device_id/alarms`           | Alarms for device         |
| GET    | `/alarm-types`                         | Alarm definitions         |
| GET    | `/alarm-types/:alarm_type`             | Details on alarm rule     |

