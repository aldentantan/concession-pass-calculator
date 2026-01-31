import { IconButton } from '@mui/material';
import { FileText, Menu, Upload, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { Button } from './ui/button';

interface NavigationBarProps {
  toggleDrawer?: () => void;
  showDrawer?: boolean;
}

export function NavigationBar({ toggleDrawer, showDrawer }: NavigationBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, signOut } = useAuth();
  const isMobile = useIsMobile();

  const currentPage = location.pathname.includes('upload')
    ? 'upload'
    : location.pathname.includes('statements') || location.pathname.includes('trip-summary')
    ? 'statements'
    : null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!session) return null;

  return (
    <nav className="w-full border-b border-slate-200 bg-white sticky top-0 z-[1200]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo/Title & Navigation */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Mobile Menu Button */}
            {isMobile && showDrawer && toggleDrawer && (
              <IconButton
                onClick={toggleDrawer}
                size="small"
                className="md:hidden"
              >
                <Menu className="w-5 h-5" />
              </IconButton>
            )}

            <h2 className="text-base md:text-lg text-slate-900 font-semibold">
              Concession Pass Calculator
            </h2>

            {/* Navigation Links - Hidden on mobile */}
            {!isMobile && (
              <div className="flex items-center gap-2">
                <Button
                  variant={currentPage === 'upload' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate('/upload')}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload PDF
                </Button>

                <Button
                  variant={currentPage === 'statements' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate('/statements')}
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  My PDFs
                </Button>
              </div>
            )}
          </div>

          {/* Right: User actions - Hidden on mobile */}
          {!isMobile && (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                onClick={handleSignOut}
              >
                Sign out
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
