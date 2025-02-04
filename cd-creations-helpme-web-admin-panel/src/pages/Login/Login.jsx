import {
  MDBBtn,
  MDBCard,
  MDBCheckbox,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import "./Login.css";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

    const handleButtonClick = () => {
        const requestBody = {
            name: username,
            password: password,
        };

        setLoading(true);

        fetch("http://93.127.198.108:5000/users/admin-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Login successful") {
                    // Save admin data locally
                    localStorage.setItem("adminData", JSON.stringify(data.admin));

                    setLoading(false);
                    navigate("/home"); // Navigate to the home page
                } else {
                    setLoading(false);
                    setError(data.message);
                }
            })
            .catch((error) => {
                setLoading(false);
                setError("Server error: " + error);
            });
    };

    return (
    <MDBContainer
      fluid
      className="d-flex align-items-center"
      style={{
        backgroundImage: `url("/login.jpg")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <MDBRow
        style={{
          display: "grid",
          alignItems: "center",
          width: "100%",
        }}
      >
        <MDBCol
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <MDBCard
            className="p-5"
            style={{
              maxWidth: "400px",
              width: "100%", // Flexible width
              minWidth: "300px", // Smaller minimum width for smaller screens
            }}
          >
            <h2 className="mb-4" style={{ textAlign: "center" }}>
              Login
            </h2>
            <MDBInput
              wrapperClass={`mb-4 ${username ? "has-text" : ""}`}
              label="Username"
              id="formControlLg"
              type="text"
              size="lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <MDBInput
              wrapperClass="mb-1"
              label="Password"
              id="formControlLg"
              type="password"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="d-flex justify-content-end mb-4">
              <a href="!#">Forgot password?</a>
            </div>

            <div>
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "3rem" }}
                >
                  <div
                    className="spinner-border text-success"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                  ></div>
                </div>
              ) : (
                <MDBBtn
                  className="mb-2 w-100"
                  size="lg"
                  onClick={handleButtonClick}
                >
                  Sign in
                </MDBBtn>
              )}
            </div>
            <div className="d-flex justify-content-center mt-1">
              <MDBCheckbox
                name="flexCheck"
                value=""
                id="flexCheckDefault"
                label="Remember me"
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;


