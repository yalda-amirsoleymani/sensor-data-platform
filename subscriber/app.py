import paho.mqtt.client as mqtt
import json
import psycopg2
import os
import time
import random

# Environment configs
MQTT_BROKER = os.getenv('MQTT_BROKER')
MQTT_PORT = int(os.getenv('MQTT_PORT'))
TOPIC = "sensors/data"

DB_HOST = "db"
DB_PORT = 5432
DB_USER = os.getenv("POSTGRES_USER")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB_NAME = os.getenv("POSTGRES_DB")

def connect_postgres():
    for attempt in range(10):
        try:
            conn = psycopg2.connect(
                host=DB_HOST,
                port=DB_PORT,
                user=DB_USER,
                password=DB_PASSWORD,
                dbname=DB_NAME
            )
            print("Connected to PostgreSQL")
            return conn
        except psycopg2.OperationalError:
            print(f"PostgreSQL not ready (attempt {attempt + 1}/10), retrying in 5s...")
            time.sleep(5)
    print("Could not connect to PostgreSQL after several attempts.")
    return None


def connect_mqtt(client):
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        print("Connected to MQTT broker")
        return
    except Exception as e:
        print(f"******************MQTT connection failed *******************************************")
    raise Exception("Could not connect to MQTT broker after several attempts.")


conn = connect_postgres()
if conn:
    cur = conn.cursor()
else:
    cur = None  # No DB cursor since no connection

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT broker with result code " + str(rc))
    client.subscribe(TOPIC)

def on_message(client, userdata, msg):
    print(f"Received message on {msg.topic}: {msg.payload}")
    data = json.loads(msg.payload)
    device_id = random.choice(list(range(1,10)))

    # Keep DB insertion commented out for now:
    if cur:
        cur.execute("""
            INSERT INTO sensor_readings (device_id, co2, gas, smoke, temperature, battery_level)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            device_id,
            data.get("co2"),
            data.get("gas"),
            data.get("smoke"),
            data.get("temperature"),
            data.get("battery_level")
        ))
        conn.commit()
        print("Inserted data into DB")

# Initialize MQTT client
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Connect to MQTT broker
connect_mqtt(client)
client.loop_forever()
