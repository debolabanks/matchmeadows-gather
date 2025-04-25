
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useGameState from "./tic-tac-toe/useGameState";
import GameBoard from "./tic-tac-toe/GameBoard";
import GameHeader from "./tic-tac-toe/GameHeader";
import ScoreBoard from "./tic-tac-toe/ScoreBoard";
import GameStatus from "./tic-tac-toe/GameStatus";
import GameInvite from "@/components/games/GameInvite";
import { useWebRTC } from "@/hooks/useWebRTC";
import VideoControls from "./tic-tac-toe/VideoControls";
import VideoStreamContainer from "./tic-tac-toe/VideoStreamContainer";

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
        await startLocalStream(!isMuted);
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
          <VideoControls 
            showVideo={showVideo}
            isMuted={isMuted}
            isMultiplayerMode={isMultiplayerMode}
            onToggleVideo={handleToggleVideo}
            onToggleMute={handleToggleMute}
          />
          
          <GameInvite 
            currentGameId="tic-tac-toe"
            currentGameName="Tic Tac Toe"
          />
        </div>
      </div>
      
      <VideoStreamContainer 
        showVideo={showVideo}
        isMuted={isMuted}
        localStream={localStream}
        remoteStreams={remoteStreams}
        localVideoRef={localVideoRef}
        contactName={state?.contactName}
        isConnecting={isConnecting}
        onToggleVideo={handleToggleVideo}
        onToggleMute={handleToggleMute}
        registerVideoRef={registerVideoRef}
      />
      
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
          draws={0} 
          opponentName={state?.contactName}
        />
        
        <GameBoard
          squares={board}
          onClick={handleSquareClick}
          winner={winner}
          isDraw={isDraw}
          currentPlayer={currentPlayer}
          contactName={state?.contactName || "Opponent"}
          isMultiplayerMode={isMultiplayerMode}
          winningLine={winner ? [0, 1, 2] : null}
        />
      </div>
    </div>
  );
};

export default TicTacToe;
