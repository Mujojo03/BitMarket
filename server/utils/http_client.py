# import os
# import requests
# from dotenv import load_dotenv

# load_dotenv()

# BASE_URL = "https://sandboxapi.bitnob.co/api/v1"
# API_KEY = os.getenv("BITNOB_API_KEY")

# def bitnob_post(endpoint, data):
#     headers = {
#         "Accept": "application/json",
#         "Content-Type": "application/json",
#         "Authorization": f"Bearer {API_KEY}"
#     }
#     url = f"{BASE_URL}{endpoint}"
#     response = requests.post(url, json=data, headers=headers)
#     response.raise_for_status()
#     return response.json()
