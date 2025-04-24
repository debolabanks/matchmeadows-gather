
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useGameState from "./tic-tac-toe/useGameState";
import GameBoard from "./tic-tac-toe/GameBoard";
import GameHeader from "./tic-tac-toe/GameHeader";
import ScoreBoard from "./tic-tac-toe/ScoreBoard";
import GameStatus from "./tic-tac-toe/GameStatus";
import { Button } from "@/components/ui/button";
import { useWebRTC } from "@/hooks/useWebRTC";
import GameInvite from "@/components/games/GameInvite";
import { ArrowLeftRight, Video, VideoOff, Mic, MicOff } from "lucide-react";

interface LocationState {
  contactId?: string;
  contactName?: string;
  multiplayer?: boolean;
  gameSessionId?: string;
}

const TicTacToe = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const {
    board,
    currentPlayer,
    winner,
    isDraw,
    scores,
    isMultiplayerMode,
    isConnected,
    handleSquareClick,
    handleResetGame
  } = useGameState(
    Array(9).fill(null),
    state?.contactId,
    state?.gameSessionId
  );
  
  const { 
    localStream,
    remoteStreams,
    localVideoRef,
    startLocalStream,
    stopLocalStream,
    registerVideoRef,
    isConnecting
  } = useWebRTC({ gameId: state?.gameSessionId });

  // Toggle video feed
  const handleToggleVideo = async () => {
    if (showVideo) {
      stopLocalStream();
      setShowVideo(false);
    } else {
      try {
        await startLocalStream(!isMuted); // Start with audio based on mute state
        setShowVideo(true);
      } catch (error) {
        console.error("Error toggling video:", error);
      }
    }
  };

  // Toggle audio
  const handleToggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  // Clean up streams when component unmounts
  useEffect(() => {
    return () => {
      stopLocalStream();
    };
  }, [stopLocalStream]);

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <GameHeader 
          gameTitle="Tic Tac Toe" 
          gameSubtitle={state?.contactName ? `Playing with ${state.contactName}` : undefined}
        />
        
        <div className="flex items-center gap-2">
          {isMultiplayerMode && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleVideo}
                className="h-9 w-9 rounded-full"
              >
                {showVideo ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleMute}
                disabled={!showVideo}
                className="h-9 w-9 rounded-full"
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </>
          )}
          
          <GameInvite 
            currentGameId="tic-tac-toe"
            currentGameName="Tic Tac Toe"
          />
        </div>
      </div>
      
      {/* Video streams container when enabled */}
      {showVideo && isMultiplayerMode && (
        <div className="mb-6 grid grid-cols-2 gap-4 h-48">
          <div className="relative rounded-lg overflow-hidden bg-muted">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 text-xs rounded">
              You
            </div>
          </div>
          
          {Array.from(remoteStreams.entries()).map(([peerId, _]) => (
            <div key={peerId} className="relative rounded-lg overflow-hidden bg-muted">
              <video
                ref={(ref) => registerVideoRef(peerId, ref)}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 text-xs rounded">
                {state?.contactName || "Opponent"}
              </div>
            </div>
          ))}
          
          {isConnecting && (
            <div className="flex items-center justify-center rounded-lg overflow-hidden bg-muted">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm">Connecting...</p>
              </div>
            </div>
          )}
          
          {!isConnecting && remoteStreams.size === 0 && (
            <div className="flex items-center justify-center rounded-lg overflow-hidden bg-muted">
              <div className="text-center text-muted-foreground">
                <p>Waiting for opponent to join...</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <GameStatus
          winner={winner}
          isDraw={isDraw}
          currentPlayer={currentPlayer}
          contactName={state?.contactName}
          onResetGame={handleResetGame}
          isMultiplayerMode={isMultiplayerMode}
        />
        
        <ScoreBoard 
          playerScore={scores.X} 
          opponentScore={scores.O}
          opponentName={state?.contactName}
        />
        
        <GameBoard
          squares={board}
          onClick={handleSquareClick}
          winningLine={winner ? [0, 1, 2] : null} // This is just a placeholder, the actual winning line should be calculated
        />
      </div>
    </div>
  );
};

export default TicTacToe;
