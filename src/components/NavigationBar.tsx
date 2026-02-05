import { FileText, Upload } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { Button } from './ui/button';

export function NavigationBar() {
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
      <div className={`max-w-[1600px] mx-auto ${isMobile ? 'px-2 py-2' : 'px-4 md:px-8 py-3 md:py-4'}`}>
        {isMobile ? (
          // Mobile layout - centered buttons with title and sign out on sides
          <div className="flex items-center justify-between gap-1">
            <h2 className="text-slate-900 font-semibold whitespace-nowrap text-lg">
              CPC
            </h2>

            <div className="flex items-center gap-2 flex-1 justify-center">
              <Button
                variant={currentPage === 'upload' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/upload')}
                className="h-8 w-8 !p-0 min-w-[32px]"
                style={{ padding: 0, minWidth: '32px', width: '32px', height: '32px' }}
              >
                <Upload className="w-4 h-4" />
              </Button>

              <Button
                variant={currentPage === 'statements' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/statements')}
                className="h-8 w-8 !p-0 min-w-[32px]"
                style={{ padding: 0, minWidth: '32px', width: '32px', height: '32px' }}
              >
                <FileText className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          // Desktop layout - original structure
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-8">
              <h2 className="text-slate-900 font-semibold whitespace-nowrap text-sm md:text-lg">
                Concession Pass Calculator
              </h2>

              <div className="flex items-center gap-1 md:gap-2">
                <Button
                  variant={currentPage === 'upload' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate('/upload')}
                  className="gap-2 px-3"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload PDF</span>
                </Button>

                <Button
                  variant={currentPage === 'statements' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate('/statements')}
                  className="gap-2 px-3"
                >
                  <FileText className="w-4 h-4" />
                  <span>My PDFs</span>
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="px-3 text-sm"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
