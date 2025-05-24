import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_root():
    response = requests.get(f"{BASE_URL}/")
    print("\n=== Testing Root Endpoint ===")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_health():
    response = requests.get(f"{BASE_URL}/api/health")
    print("\n=== Testing Health Endpoint ===")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_auth_endpoints():
    # Test registration (this will create a new user, so use unique email)
    test_user = {
        "email": f"test{int(__import__('time').time())}@example.com",
        "password": "testpassword123",
        "fullName": "Test User"
    }
    
    print("\n=== Testing Registration ===")
    reg_response = requests.post(f"{BASE_URL}/api/auth/register", json=test_user)
    print(f"Status Code: {reg_response.status_code}")
    if reg_response.status_code == 201:
        print("Registration successful!")
        reg_data = reg_response.json()
        token = reg_data.get('token')
        
        # Test get current user
        print("\n=== Testing Get Current User ===")
        me_response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        print(f"Status Code: {me_response.status_code}")
        if me_response.status_code == 200:
            print(f"User data: {json.dumps(me_response.json(), indent=2)}")
            return True
    else:
        print(f"Registration failed: {reg_response.text}")
        
        # Try login instead
        print("\n=== Testing Login ===")
        login_data = {
            "email": "test@example.com",  # Use an existing user
            "password": "testpassword123"
        }
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Status Code: {login_response.status_code}")
        if login_response.status_code == 200:
            print("Login successful!")
            return True
    
    return False

def test_products_endpoints():
    print("\n=== Testing Get Products ===")
    response = requests.get(f"{BASE_URL}/api/products")
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        products = response.json()
        print(f"Found {len(products)} products")
        if len(products) > 0:
            product_id = products[0]['id']
            
            # Test get product by ID
            print(f"\n=== Testing Get Product {product_id} ===")
            product_response = requests.get(f"{BASE_URL}/api/products/{product_id}")
            print(f"Status Code: {product_response.status_code}")
            if product_response.status_code == 200:
                print(f"Product data: {json.dumps(product_response.json(), indent=2)}")
                return True
    else:
        print(f"Failed to get products: {response.text}")
    
    return False

def main():
    print("=== BitMarket API Test ===")
    
    tests = [
        ("Root Endpoint", test_root),
        ("Health Endpoint", test_health),
        ("Auth Endpoints", test_auth_endpoints),
        ("Products Endpoints", test_products_endpoints)
    ]
    
    results = []
    
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"Error testing {name}: {str(e)}")
            results.append((name, False))
    
    print("\n=== Test Results ===")
    all_passed = True
    for name, result in results:
        status = "PASSED" if result else "FAILED"
        print(f"{name}: {status}")
        if not result:
            all_passed = False
    
    if all_passed:
        print("\n✅ All tests passed! Your API is working correctly.")
    else:
        print("\n❌ Some tests failed. Please check the output above for details.")

if __name__ == "__main__":
    main()