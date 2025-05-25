
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.access_token);
        navigate("/payment");
      } else {
        alert(`Login failed: ${data.message}`);
      }
    } catch (err) {
      alert("An error occurred during login.");
      console.error(err);
    }
  };

  return (
    <section
      className="vh-100 bg-image"
      style={{
        backgroundImage:
          "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img3.webp')",
      }}
    >
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-4">Login</h2>
                  <form onSubmit={handleLogin}>
                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label" htmlFor="email">
                        Your Email
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control form-control-lg"
                        required
                      />
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                      >
                        Login
                      </button>
                    </div>

                    <p className="text-center text-muted mt-4 mb-0">
                      Don't have an account?{" "}
                      <Link to="/register" className="fw-bold text-body">
                        <u>Register here</u>
                      </Link>
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

export default Login;

// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./login.css";

// function Login() {
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//   e.preventDefault();

//   const email = e.target.email.value;
//   const password = e.target.password.value;

//   try {
//     const response = await fetch("http://localhost:5000/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       alert("Login successful!");
//       // Save token if needed: localStorage.setItem("token", data.token);
//       navigate("/payment");
//     } else {
//       alert(`Login failed: ${data.message}`);
//     }
//   } catch (err) {
//     alert("An error occurred during login.");
//     console.error(err);
//   }
// };

//   return (
//     <section
//       className="vh-100 bg-image"
//       style={{
//         backgroundImage:
//           "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img3.webp')",
//       }}
//     >
//       <div className="mask d-flex align-items-center h-100 gradient-custom-3">
//         <div className="container h-100">
//           <div className="row d-flex justify-content-center align-items-center h-100">
//             <div className="col-12 col-md-9 col-lg-7 col-xl-6">
//               <div className="card" style={{ borderRadius: "15px" }}>
//                 <div className="card-body p-5">
//                   <h2 className="text-uppercase text-center mb-4">Login</h2>
//                   <form onSubmit={handleLogin}>
//                     <div className="form-outline mb-4">
//                       <input
//                         type="email"
//                         id="email"
//                         className="form-control form-control-lg"
//                         required
//                       />
//                       <label className="form-label" htmlFor="email" required>
//                         Your Email
//                       </label>
//                     </div>

//                     <div className="form-outline mb-4">
//                       <input
//                         type="password"
//                         id="password"
//                         className="form-control form-control-lg"
//                         required
//                       />
//                       <label className="form-label" htmlFor="password" required>
//                         Password
//                       </label>
//                     </div>

//                     <div className="d-flex justify-content-center">
//                       <button
//                         type="submit"
//                         className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
//                       >
//                         Login
//                       </button>
//                     </div>

//                     <p className="text-center text-muted mt-4 mb-0">
//                       Don't have an account?{" "}
//                       <Link to="/register" className="fw-bold text-body">
//                         <u>Register here</u>
//                       </Link>
//                     </p>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Login;