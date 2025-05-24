from dotenv import load_dotenv
import os

load_dotenv()

print("SUPABASE_URL:", os.getenv("SUPABASE_URL"))
print("SUPABASE_KEY:", os.getenv("SUPABASE_KEY"))
print("SUPABASE_ANON_KEY:", os.getenv("SUPABASE_ANON_KEY"))
print("JWT_SECRET:", os.getenv("JWT_SECRET"))
