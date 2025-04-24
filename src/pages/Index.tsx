
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-love-100 to-love-200 -z-10" />
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Heart className="h-16 w-16 text-love-500 mx-auto mb-6 animate-pulse-heart" />
              <h1 className="text-4xl md:text-6xl font-bold text-love-950 mb-6">
                Find Your Perfect Match
              </h1>
              <p className="text-xl md:text-2xl text-love-800 mb-8">
                Join MatchMeadows today and discover meaningful connections with like-minded people.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-base">
                  <Link to="/discover">Start Matching</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Choose MatchMeadows?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <div className="bg-love-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-love-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Meaningful Connections</h3>
                <p className="text-muted-foreground">
                  Our matching algorithm helps you find people who share your interests and values.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <div className="bg-love-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-love-500">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Privacy Focused</h3>
                <p className="text-muted-foreground">
                  Your privacy is our priority. You control who sees your profile and information.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <div className="bg-love-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-love-500">
                    <path d="M20 7h-9" />
                    <path d="M14 17H5" />
                    <circle cx="17" cy="17" r="3" />
                    <circle cx="7" cy="7" r="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Advanced Filtering</h3>
                <p className="text-muted-foreground">
                  Set your preferences and find exactly what you're looking for in a partner.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-love-500 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to find your match?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of singles who have found meaningful relationships on MatchMeadows.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-love-500">
              <Link to="/discover" className="flex items-center gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
