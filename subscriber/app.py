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

DB_HOST = os.getenv("RDS_HOST")
DB_PORT = 5432
DB_USER = os.getenv("RDS_USER")
DB_PASSWORD = os.getenv("RDS_PASSWORD")
DB_NAME = os.getenv("RDS_DB")

def connect_postgres():
    for attempt in range(10):
        try:
            print(f"@@@ THIS IS A TEST0 MESSAGE @@@")
            conn = psycopg2.connect(
                host=DB_HOST,
                port=DB_PORT,
                user=DB_USER,
                password=DB_PASSWORD,
                dbname=DB_NAME
            )
            print("Connected to PostgreSQL")
            return conn
        except Exception as e:
#        except psycopg2.OperationalError as e:
            print(f"PostgreSQL not ready (attempt {attempt + 1}/10), retrying in 5s...")
            print(f"@@@ THIS IS A TEST1 MESSAGE @@@")
            print("ERROR: ", e)
            time.sleep(5)
    print("Could not connect to PostgreSQL after several attempts.")
    print(f"@@@ THIS IS A TEST2 MESSAGE @@@")
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


count = 0

def on_message(client, userdata, msg):
    global count
    print(f"Received message on {msg.topic}: {msg.payload}")
    data = json.loads(msg.payload)
    device_id = random.choice(list(range(1,10)))

    if cur and count < 5:
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
        count += 1
        print(f"Inserted data into DB. Count: {count}")
    elif count >= 5:
        print("Reached 5 inserts, skipping further DB writes.")

# Initialize MQTT client
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Connect to MQTT broker
connect_mqtt(client)
client.loop_forever()

