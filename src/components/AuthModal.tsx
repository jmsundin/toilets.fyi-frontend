import { useState } from "react";
import { supabase } from "../supabaseClient";
import { FiX, FiMail, FiLock } from 'react-icons/fi';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else {
      alert("Check your email for confirmation!");
      onClose();
    }
    setLoading(false);
  };

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      onClose();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="auth-modal-overlay" onClick={onClose} />
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
          <button onClick={onClose} className="close-button" aria-label="Close">
            <FiX size={24} />
          </button>
        </div>

        <div className="auth-modal-content">
          <div className="auth-input-group">
            <FiMail size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <FiLock size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            className="auth-button"
            onClick={mode === 'login' ? signIn : signUp}
            disabled={loading}
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </div>
    </>
  );
} 