import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { ShieldAlert, LogIn, LogOut, LayoutDashboard, Compass, Sparkles } from 'lucide-react';

interface NavbarProps {
  isAdminView: boolean;
  onToggleAdminView: (val: boolean) => void;
  onScrollTo: (elementId: string) => void;
}

export default function Navbar({ isAdminView, onToggleAdminView, onScrollTo }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === 'juneyoungsuh93@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        onToggleAdminView(false); // turn off admin view if logged out
      }
    });
    return () => unsubscribe();
  }, [onToggleAdminView]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login failed:", err);
      alert("구글 로그인에 실패했습니다. 팝업 차단이 되어있다면 해제해 주세요.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 transition-shadow hover:shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onScrollTo('hero-section')}>
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg block">
                MASTER CLEANING
              </span>
              <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase block -mt-1">
                Your Space. Perfectly Clean
              </span>
            </div>
          </div>

          {/* Nav Links */}
          {!isAdminView && (
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
              <button onClick={() => onScrollTo('hero-section')} className="hover:text-blue-600 transition-colors">Home</button>
              <button onClick={() => onScrollTo('services-section')} className="hover:text-blue-600 transition-colors">Services</button>
              <button onClick={() => onScrollTo('why-us-section')} className="hover:text-blue-600 transition-colors">About</button>
              <button onClick={() => onScrollTo('before-after-section')} className="hover:text-blue-600 transition-colors">Before/After</button>
              <button onClick={() => onScrollTo('reviews-section')} className="hover:text-blue-600 transition-colors">Reviews</button>
              <button onClick={() => onScrollTo('reservation-section')} className="hover:text-blue-600 transition-colors">Reservation</button>
              <button onClick={() => onScrollTo('contact-section')} className="hover:text-blue-600 transition-colors">Contact</button>
            </div>
          )}

          {/* Auth Controls & Admin toggle */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* User Info */}
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800">{user.displayName || "관리자"}</p>
                  <p className="text-[10px] text-slate-400">{user.email}</p>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User Avatar" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-slate-200" />
                ) : (
                  <div className="w-8 h-8 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                    {user.displayName?.substring(0, 1) || "A"}
                  </div>
                )}

                {/* Admin toggle if authenticated as juneyoungsuh93@gmail.com */}
                {isAdmin && (
                  <button
                    id="btn-toggle-admin-view"
                    onClick={() => onToggleAdminView(!isAdminView)}
                    className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                      isAdminView 
                        ? 'bg-amber-100 text-amber-800 border border-amber-200 shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {isAdminView ? (
                      <>
                        <Compass className="w-3.5 h-3.5" />
                        고객용 홈페이지
                      </>
                    ) : (
                      <>
                        <LayoutDashboard className="w-3.5 h-3.5 text-amber-600" />
                        관리자 대시보드
                      </>
                    )}
                  </button>
                )}

                {/* Logout Button */}
                <button
                  id="btn-logout"
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-login"
                onClick={handleLogin}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold py-2 px-3 rounded-lg transition-all shadow hover:shadow-md"
              >
                <LogIn className="w-3.5 h-3.5" />
                관리자 로그인
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
