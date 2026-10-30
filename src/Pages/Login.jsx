import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    alert("Login UI demo only. Authentication is not connected yet.");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <div className="brand-icon">D</div>
            <span>DigiGold</span>
          </div>

          <div className="login-content">
            <span className="login-tag">SMART GOLD INVESTING</span>

            <h1>
              Your Gold.
              <br />
              Your Future.
            </h1>

            <p>
              Welcome to a smarter way of saving and investing in digital gold.
              Secure, simple and convenient.
            </p>

            <div className="login-feature">
              <ShieldCheck size={21} />
              <span>Designed with security in mind</span>
            </div>
          </div>

          <div className="login-footer">
            © 2026 DigiGold. All rights reserved.
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-wrapper">
            <div className="mobile-brand">
              <div className="brand-icon">D</div>
              <span>DigiGold</span>
            </div>

            <span className="welcome-label">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p className="login-subtitle">
              Enter your details to access your portfolio.
            </p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email Address</label>

                <div className="login-input">
                  <Mail size={19} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="password-label">
                  <label>Password</label>
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>

                <div className="login-input">
                  <LockKeyhole size={19} />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <button type="submit" className="login-submit">
                Sign In
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="google-login"
              onClick={() =>
                alert("Google authentication will be integrated later.")
              }
            >
              <span className="google-icon">G</span>
              Continue with Google
            </button>

            <p className="register-link">
              Don't have an account?
              <Link to="/register"> Create account</Link>
            </p>

            <div className="login-security">
              <ShieldCheck size={15} />
              Secure login experience
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
