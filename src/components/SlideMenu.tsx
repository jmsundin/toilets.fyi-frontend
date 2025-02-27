import { useState } from 'react';
import { FiX, FiLogIn, FiUserPlus, FiLogOut } from 'react-icons/fi';
import './SlideMenu.css';
import { AuthModal } from './AuthModal';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

interface SlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

export function SlideMenu({ isOpen, onClose, session }: SlideMenuProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  return (
    <>
      <div className={`slide-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2>Menu</h2>
          <button onClick={onClose} className="close-button" aria-label="Close">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="menu-content">
          {session ? (
            <>
              <div className="user-profile">
                <span>{session.user.email}</span>
              </div>
              <button 
                className="menu-button"
                onClick={handleSignOut}
              >
                <FiLogOut size={20} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <button 
                className="menu-button"
                onClick={() => setAuthMode('login')}
              >
                <FiLogIn size={20} />
                <span>Login</span>
              </button>
              
              <button 
                className="menu-button"
                onClick={() => setAuthMode('signup')}
              >
                <FiUserPlus size={20} />
                <span>Sign Up</span>
              </button>
            </>
          )}
        </div>
      </div>
      
      {isOpen && <div className="menu-overlay" onClick={onClose} />}

      <AuthModal 
        isOpen={authMode !== null}
        onClose={() => setAuthMode(null)}
        mode={authMode || 'login'}
      />
    </>
  );
} 