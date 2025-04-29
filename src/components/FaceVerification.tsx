
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Camera, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const FaceVerification = () => {
  const [verificationState, setVerificationState] = useState<"idle" | "capturing" | "processing" | "success" | "error">("idle");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();

  // Start camera when component mounts
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        } 
      });
      
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use face verification",
        variant: "destructive",
      });
      setVerificationState("error");
    }
  };

  // Stop camera when component unmounts
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Start verification process
  const startVerification = async () => {
    await startCamera();
    setVerificationState("capturing");
    setCountdown(3);
  };

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data
        const imageData = canvas.toDataURL("image/jpeg");
        
        // In a real app, you would send this to a verification service
        // Here we'll simulate processing and success
        processVerification(imageData);
      }
    }
  };

  // Process verification (simulated)
  const processVerification = (imageData: string) => {
    setVerificationState("processing");
    
    // Simulate API call for face verification
    setTimeout(() => {
      // In a real app, this would be the result from your verification API
      const verificationSuccessful = true;
      
      if (verificationSuccessful) {
        setVerificationState("success");
        
        // Update user profile with verification status
        updateProfile({
          faceVerified: true,
          faceVerificationDate: new Date().toISOString(),
          verificationStatus: "verified"
        });
        
        toast({
          title: "Verification successful",
          description: "Your face has been verified successfully",
        });
      } else {
        setVerificationState("error");
        toast({
          title: "Verification failed",
          description: "We couldn't verify your face. Please try again.",
          variant: "destructive",
        });
      }
      
      stopCamera();
    }, 2000);
  };

  // Countdown effect
  useEffect(() => {
    if (countdown !== null) {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        captureImage();
      }
    }
  }, [countdown]);

  // Check if user is already verified
  const isVerified = user?.profile?.faceVerified;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Face Verification
        </CardTitle>
        <CardDescription>
          Verify your identity by taking a selfie. This helps keep our community safe.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isVerified ? (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-medium">Verification Complete</h3>
            <p className="text-muted-foreground mt-2">
              Your face has been verified successfully on {' '}
              {user?.profile?.faceVerificationDate 
                ? new Date(user.profile.faceVerificationDate).toLocaleDateString() 
                : 'a previous date'}
            </p>
          </div>
        ) : (
          <div>
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-video mb-4">
              {verificationState === "idle" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button onClick={startVerification}>
                    Start Verification
                  </Button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${verificationState !== "capturing" ? "hidden" : ""}`}
                  />
                  
                  {countdown !== null && countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                      <span className="text-6xl font-bold">{countdown}</span>
                    </div>
                  )}
                  
                  {verificationState === "processing" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                      <Loader2 className="h-12 w-12 animate-spin mb-4" />
                      <p>Processing your verification...</p>
                    </div>
                  )}
                  
                  {verificationState === "success" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                      <p>Verification successful!</p>
                    </div>
                  )}
                  
                  {verificationState === "error" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                      <div className="text-red-500 mb-4">❌</div>
                      <p>Verification failed. Please try again.</p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="text-sm text-muted-foreground mt-2">
              <p>Your face scan will be used only for identity verification and will be processed securely.</p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {verificationState === "error" && (
          <Button onClick={startVerification}>Try Again</Button>
        )}
        
        {isVerified && (
          <Button variant="outline" onClick={() => {
            updateProfile({
              faceVerified: false,
              verificationStatus: "unverified"
            });
            toast({
              title: "Verification reset",
              description: "You can now verify your face again",
            });
          }}>
            Reset Verification
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FaceVerification;
