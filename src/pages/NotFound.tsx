import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-body">
      <div className="text-center glass-card p-12 rounded-[3rem] animate-in fade-in zoom-in-95 duration-700">
        <h1 className="mb-6 text-8xl font-black tracking-tighter text-primary">404</h1>
        <p className="mb-8 text-2xl font-bold tracking-tight text-foreground/80">Page not found</p>
        <p className="mb-10 text-muted-foreground/60 max-w-xs mx-auto leading-relaxed">
          The link you followed may be broken or the page may have been removed.
        </p>
        <a 
          href="/" 
          className="inline-flex h-14 px-8 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
