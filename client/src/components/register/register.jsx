import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems || [];

const handleSubmit = async (e) => {
  e.preventDefault();

  const name = e.target.form3Example1cg.value;
  const email = e.target.form3Example3cg.value;
  const password = e.target.form3Example4cg.value;

  try {
    const response = await fetch("http://localhost:5000/register/buyer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful!");
      navigate("/payment");
    } else {
      alert(`Registration failed: ${data.message}`);
    }
  } catch (err) {
    alert("An error occurred during registration.");
    console.error(err);
  }
};

  return (
    <section
      className="vh-100 bg-image"
      style={{
        backgroundImage:
          "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
      }}
    >
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-4">
                    Create an account
                  </h2>

                  {/* Display Cart Summary */}
                  {cartItems.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-center">Cart Summary</h5>
                      <ul className="list-group">
                        {cartItems.map((item, index) => (
                          <li
                            key={index}
                            className="list-group-item d-flex justify-content-between"
                          >
                            <span>{item.name}</span>
                            <span>Qty: {item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="form3Example1cg"
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label" htmlFor="form3Example1cg">
                        Your Name
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        id="form3Example3cg"
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label" htmlFor="form3Example3cg">
                        Your Email
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="form3Example4cg"
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label" htmlFor="form3Example4cg">
                        Password
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="form3Example4cdg"
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label" htmlFor="form3Example4cdg">
                        Repeat your password
                      </label>
                    </div>

                    <div className="form-check d-flex justify-content-center mb-5">
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        id="form2Example3cg"
                        required
                      />
                      <label
                        className="form-check-label"
                        htmlFor="form2Example3cg"
                      >
                        I agree to all statements in{" "}
                        <a href="#!" className="text-body">
                          <u>Terms of service</u>
                        </a>
                      </label>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                      >
                        Register
                      </button>
                    </div>

                    <p className="text-center text-muted mt-5 mb-0">
                      Already have an account?{" "}
                      <a href="/login" className="fw-bold text-body">
                        <u>Login here</u>
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;