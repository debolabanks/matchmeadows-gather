
export const FeaturesGrid = () => {
  return (
    <div className="mt-12 text-center">
      <h3 className="text-xl font-semibold mb-4">All Premium Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4">
          <div className="mb-2 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="m22 8-6 4 6 4V8Z"></path>
              <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
            </svg>
          </div>
          <h4 className="font-medium mb-1">Go Live Streaming</h4>
          <p className="text-sm text-muted-foreground">
            Start your own live streams and connect with your followers in real-time
          </p>
        </div>
        
        <div className="p-4">
          <div className="mb-2 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <rect width="20" height="14" x="2" y="5" rx="2"></rect>
              <line x1="2" x2="22" y1="10" y2="10"></line>
            </svg>
          </div>
          <h4 className="font-medium mb-1">Ad-Free Experience</h4>
          <p className="text-sm text-muted-foreground">
            Enjoy browsing without any advertisements or distractions
          </p>
        </div>
        
        <div className="p-4">
          <div className="mb-2 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"></path>
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <circle cx="12" cy="10" r="2"></circle>
              <line x1="8" x2="8" y1="2" y2="4"></line>
              <line x1="16" x2="16" y1="2" y2="4"></line>
            </svg>
          </div>
          <h4 className="font-medium mb-1">Priority Matching</h4>
          <p className="text-sm text-muted-foreground">
            Get priority in the matching algorithm and more visibility
          </p>
        </div>
      </div>
    </div>
  );
};
