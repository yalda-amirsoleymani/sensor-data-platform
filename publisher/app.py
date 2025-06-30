import paho.mqtt.client as mqtt
import json
import time
import os
import random

MQTT_BROKER = os.getenv("MQTT_BROKER", "mqtt_broker")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
MQTT_TOPIC = "sensors/data"
device_ids = list(range(1, 12))  # [1 to 11]

def generate_fake_data():
    return {
        "device_id": random.choice(device_ids),
        "co2": round(random.uniform(300, 800), 2),
        "gas": round(random.uniform(0, 100), 2),
        "smoke": round(random.uniform(0, 100), 2),
        "temperature": round(random.uniform(18, 40), 1),
        "battery_level": round(random.uniform(30, 100), 1),
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

client = mqtt.Client()

def connect_mqtt():
    print("Waiting 10 seconds for MQTT broker to be ready...")
    time.sleep(10)
    try:
        client.connect(MQTT_BROKER, MQTT_PORT)
        print(f"Connected to MQTT broker at {MQTT_BROKER}:{MQTT_PORT}")
    except Exception as e:
        print("*******************************************************************")
        print(f"Error: {e}")
        raise Exception("Could not connect to MQTT broker after several attempts.")

connect_mqtt()
client.loop_start()

try:
    while True:
        payload = generate_fake_data()
        client.publish(MQTT_TOPIC, json.dumps(payload))
        print(f"Published: {payload}")
        time.sleep(2)  # Send data every 2 seconds
except KeyboardInterrupt:
    print("Publisher stopped.")
finally:
    client.loop_stop()
    client.disconnect()

