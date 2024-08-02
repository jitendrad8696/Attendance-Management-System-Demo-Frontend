import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/login.service";

function Login() {
  useEffect(() => {
    localStorage.removeItem("user");
  }, []);

  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      setError("Email and password are required.");
      return;
    }

    if (!validateEmail(user.email)) {
      setError("Invalid email format.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await loginApi(user);
      if (response.success) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser({
          email: "",
          password: "",
        });
        setError(null);
        setLoading(false);
        navigate("/Dashboard");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(
          err.message || "Login failed. Please check your email and password."
        );
      } else {
        setError("An unexpected error occurred.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row temp-row">
        <div className="col">
          <h1 className="heading mb-4">Login</h1>
          <form onSubmit={onSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <label htmlFor="email" className="form-label heading">
              Email
            </label>
            <input
              type="text"
              name="email"
              className="form-control"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
            <label htmlFor="password" className="form-label mt-2 heading">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
            <button
              type="submit"
              className="btn btn-primary mt-4 px-4 py-2"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
