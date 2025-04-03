
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, ChevronLeft, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const TermsOfUse = () => {
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const handleAccept = async () => {
    if (!accepted) {
      toast({
        variant: "destructive",
        title: "Agreement Required",
        description: "You must accept the terms to continue"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Update user profile to mark terms as accepted
      await updateProfile({
        termsAccepted: new Date().toISOString()
      });
      
      toast({
        title: "Welcome to MatchMeadows!",
        description: "Terms accepted, you're all set to continue"
      });
      
      navigate("/discover");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your preferences"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <Heart className="h-8 w-8 text-love-500 animate-pulse-heart" />
        <span className="font-bold text-2xl text-love-700">MatchMeadows</span>
      </Link>
      
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Terms of Use</CardTitle>
          <CardDescription>
            Please read and accept our terms and conditions before continuing
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. Introduction</h3>
              <p>Welcome to MatchMeadows, a dating platform designed to help you meet new people. By using our services, you agree to these Terms of Use, our Privacy Policy, and our Community Guidelines.</p>
              
              <h3 className="text-lg font-semibold">2. Eligibility</h3>
              <p>You must be at least 18 years old to use MatchMeadows. By accessing or using our services, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms.</p>
              
              <h3 className="text-lg font-semibold">3. User Accounts</h3>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
              
              <h3 className="text-lg font-semibold">4. Acceptable Use</h3>
              <p>You agree not to use the service for any unlawful purpose or in a way that could damage, disable, overburden, or impair the service. You also agree not to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Post content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
                <li>Create fake profiles or misrepresent yourself</li>
                <li>Use the platform to send spam or solicit other users for commercial purposes</li>
                <li>Attempt to access data not intended for you</li>
                <li>Harass, intimidate, or threaten other users</li>
              </ul>
              
              <h3 className="text-lg font-semibold">5. Privacy</h3>
              <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and disclose information about you.</p>
              
              <h3 className="text-lg font-semibold">6. Termination</h3>
              <p>We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason at our sole discretion.</p>
              
              <h3 className="text-lg font-semibold">7. Changes to Terms</h3>
              <p>We may modify these Terms at any time. If we make material changes, we will notify you through the Service or by other means. Your continued use of the Service after such notification constitutes your acceptance of the updated Terms.</p>
              
              <h3 className="text-lg font-semibold">8. Disclaimer of Warranties</h3>
              <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
              
              <h3 className="text-lg font-semibold">9. Limitation of Liability</h3>
              <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL MATCHMEADOWS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES.</p>
              
              <h3 className="text-lg font-semibold">10. Governing Law</h3>
              <p>These Terms shall be governed by the laws of the jurisdiction in which MatchMeadows operates, without regard to its conflict of law provisions.</p>
            </div>
          </ScrollArea>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="terms" 
              checked={accepted} 
              onCheckedChange={(checked) => setAccepted(checked === true)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and agree to the Terms of Use and Privacy Policy
            </label>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3">
          <div className="flex w-full space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleAccept}
              disabled={isLoading}
            >
              <Shield className="h-4 w-4 mr-2" />
              Accept & Continue
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TermsOfUse;
