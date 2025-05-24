import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SUPABASE_URL = os.getenv('https://bikchebmktwvpgmhewlw.supabase.co')
    SUPABASE_KEY = os.getenv('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpa2NoZWJta3R3dnBnbWhld2x3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEyNjc0MywiZXhwIjoyMDYyNzAyNzQzfQ.WVDT7inOZzB9L90VPoW8_8RZzkqPSdcLvk_kkXHMNk8')
    SUPABASE_ANON_KEY = os.getenv('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpa2NoZWJta3R3dnBnbWhld2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMjY3NDMsImV4cCI6MjA2MjcwMjc0M30.jmK9qzH3IshcbF4DCQvwfZZuFtVOSF4Ll1wgDV1Lm6g')
    JWT_SECRET = os.getenv('K70CBNpykRu0RH5ix9Iu599ICiFyIBynRH8w9PKdW7HQrVqp8iz4O30hxeMjFqvbt0LgrW8N2McRl+XHHwxeHQ==')
    DEBUG = os.getenv('FLASK_ENV') == 'development'

# SUPABASE_URL=https://your-project-ref.supabase.co
# SUPABASE_KEY=your-service-role-key
# SUPABASE_ANON_KEY=your-anon-key
# JWT_SECRET=your-custom-jwt-secret
# FLASK_ENV=development
