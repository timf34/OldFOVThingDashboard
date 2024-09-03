"""
A temporary script to simulate an FOV Tablet and send similar messages to a topic.
"""
import dotenv
import json
import os
import time

from aws_iot.IOTClient import IOTClient
from aws_iot.IOTContext import IOTContext, IOTCredentials

CERT_PATH = "aws-iot-certs/fov-dashboard-client-dublin-1-certificate.pem.crt"
PRIVATE_KEY_PATH = "aws-iot-certs/fov-dashboard-client-dublin-1-private.pem.key"
ROOT_CA_PATH = "aws-iot-certs/AmazonRootCA1.pem"
ENDPOINT = "a3lkzcadhi1yzr-ats.iot.eu-west-1.amazonaws.com"

def initialize_iot_manager() -> IOTClient:

    cwd = os.getcwd()

    iot_context = IOTContext()

    iot_credentials = IOTCredentials(
        cert_path=CERT_PATH,
        client_id="FOVTablet-Simulator",
        endpoint=ENDPOINT,
        priv_key_path=PRIVATE_KEY_PATH,
        ca_path=ROOT_CA_PATH
    )

    return IOTClient(iot_context, iot_credentials, publish_topic="hello")


def main():
    dotenv.load_dotenv()
    iot_client = initialize_iot_manager()
    iot_client.connect()

    while True:
        iot_client.publish(payload=json.dumps("Hello from FOV Tablet Simulator"))
        time.sleep(5)


if __name__ == "__main__":
    main()