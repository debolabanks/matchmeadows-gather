
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-6">
        <Link to="/" className="flex items-center text-love-500 hover:text-love-600 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-6">About MatchMeadows</h1>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            At MatchMeadows, we believe that meaningful connections are the foundation of happiness. Our platform is designed to help you find people who share your values, interests, and goals, making it easier to build genuine relationships in today's fast-paced world.
          </p>
          <p className="text-muted-foreground">
            We're committed to creating a safe, inclusive environment where everyone feels welcome and respected. Our advanced matching algorithm focuses on compatibility beyond just appearances, helping you connect with people who truly complement your life.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 my-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Create Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Share your interests, values, and what you're looking for. The more authentic you are, the better your matches will be.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Discover Matches</h3>
              <p className="text-sm text-muted-foreground">
                Our algorithm presents potential matches based on compatibility. Browse profiles and express interest in those you'd like to connect with.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Connect & Communicate</h3>
              <p className="text-sm text-muted-foreground">
                When there's mutual interest, you can message each other and even have voice or video calls to deepen your connection.
              </p>
            </div>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Meet Our Creators</h2>
          <p className="text-muted-foreground mb-4">
            MatchMeadows features a dedicated community of relationship experts, dating coaches, and mentors who provide guidance and support on your journey to finding meaningful connections.
          </p>
          <p className="text-muted-foreground">
            Our verified creators offer personalized advice, host group sessions, and share valuable insights to help you navigate the complexities of modern relationships.
          </p>
          <div className="mt-4">
            <Link to="/creators" className="text-love-500 hover:text-love-600 font-medium">
              Explore our creator community →
            </Link>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Privacy & Safety</h2>
          <p className="text-muted-foreground mb-4">
            Your privacy and safety are our top priorities. We implement robust verification processes, strong data protection measures, and clear community guidelines to ensure a respectful experience for all users.
          </p>
          <p className="text-muted-foreground">
            MatchMeadows gives you full control over who can see your profile, contact you, and how much information you share. We believe in creating a platform where everyone feels secure to be themselves.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
