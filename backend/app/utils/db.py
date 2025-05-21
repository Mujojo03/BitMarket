# import os
# from supabase import create_client, Client
# from dotenv import load_dotenv

# load_dotenv()

# supabase_url = os.getenv('')
# supabase_key = os.getenv('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpa2NoZWJta3R3dnBnbWhld2x3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEyNjc0MywiZXhwIjoyMDYyNzAyNzQzfQ.WVDT7inOZzB9L90VPoW8_8RZzkqPSdcLvk_kkXHMNk8')

# supabase: Client = create_client(supabase_url, supabase_key)

# def get_supabase():
#     return supabase

# print("SUPABASE_URL:", supabase_url)
# print("SUPABASE_KEY:", supabase_key)

import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")  # this must be the NAME of the env variable
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise Exception("SUPABASE_URL and SUPABASE_KEY must be set in your .env file")

supabase: Client = create_client(supabase_url, supabase_key)

def get_supabase() -> Client:
    return supabase
