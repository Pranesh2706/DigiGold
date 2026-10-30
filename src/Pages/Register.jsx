import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import "./Register.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [agree, setAgree] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!agree) {
      alert("Please accept the Terms and Conditions.");
      return;
    }

    alert("Registration UI demo successful! Backend is not connected yet.");
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* LEFT SECTION */}

        <div className="register-left">
          <div className="register-brand">
            <div className="register-brand-icon">D</div>
            <span>DigiGold</span>
          </div>

          <div className="register-content">
            <span className="register-tag">START YOUR GOLD JOURNEY</span>

            <h1>
              Invest Today.
              <br />
              Shine Tomorrow.
            </h1>

            <p>
              Create your DigiGold account and take the first step towards
              building your digital gold portfolio.
            </p>

            <div className="register-feature">
              <ShieldCheck size={21} />
              <span>A simple and secure account experience</span>
            </div>
          </div>

          <div className="register-footer">
            © 2026 DigiGold. All rights reserved.
          </div>
        </div>

        {/* RIGHT SECTION */}

        <div className="register-right">
          <div className="register-form-wrapper">
            <div className="register-mobile-brand">
              <div className="register-brand-icon">D</div>
              <span>DigiGold</span>
            </div>

            <span className="register-welcome">GET STARTED</span>

            <h2>Create your account</h2>

            <p className="register-subtitle">
              Enter your details to join DigiGold.
            </p>

            <form onSubmit={handleRegister}>
              {/* NAME */}

              <div className="register-group">
                <label>Full Name</label>

                <div className="register-input">
                  <User size={18} />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="register-group">
                <label>Email Address</label>

                <div className="register-input">
                  <Mail size={18} />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* PHONE */}

              <div className="register-group">
                <label>Mobile Number</label>

                <div className="register-input">
                  <Phone size={18} />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div className="register-group">
                <label>Password</label>

                <div className="register-input">
                  <LockKeyhole size={18} />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="register-group">
                <label>Confirm Password</label>

                <div className="register-input">
                  <LockKeyhole size={18} />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* TERMS */}

              <label className="register-terms">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />

                <span>
                  I agree to the Terms & Conditions and Privacy Policy.
                </span>
              </label>

              {/* BUTTON */}

              <button type="submit" className="register-submit">
                Create Account
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="register-login-link">
              Already have an account?
              <Link to="/login"> Sign in</Link>
            </p>

            <div className="register-security">
              <ShieldCheck size={15} />
              Your information is handled securely
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
