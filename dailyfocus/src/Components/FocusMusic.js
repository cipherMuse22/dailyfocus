import React, { useState, useEffect, useRef } from 'react';

const FocusMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentSound, setCurrentSound] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  
  const audioRef = useRef(null);

  const sounds = [
    {
      id: 'rain',
      name: 'Rain',
      emoji: '🌧️',
      description: 'Gentle rain for deep focus',
      color: '#3b82f6'
    },
    {
      id: 'forest',
      name: 'Forest',
      emoji: '🌲',
      description: 'Birds and nature sounds',
      color: '#10b981'
    },
    {
      id: 'cafe',
      name: 'Coffee Shop',
      emoji: '☕',
      description: 'Ambient cafe background',
      color: '#8b5cf6'
    },
    {
      id: 'white',
      name: 'White Noise',
      emoji: '📻',
      description: 'Consistent sound masking',
      color: '#6b7280'
    },
    {
      id: 'waves',
      name: 'Ocean Waves',
      emoji: '🌊',
      description: 'Calming ocean sounds',
      color: '#06b6d4'
    },
    {
      id: 'piano',
      name: 'Piano',
      emoji: '🎹',
      description: 'Soft piano melodies',
      color: '#ef4444'
    }
  ];

  // These are base64 encoded short audio samples
  // In production, you'd use actual audio files
  const soundFiles = {
    rain: 'https://assets.mixkit.co/music/preview/mixkit-rain-loop-1241.mp3',
    forest: 'https://assets.mixkit.co/music/preview/mixkit-forest-birds-1290.mp3',
    cafe: 'https://assets.mixkit.co/music/preview/mixkit-coffee-shop-ambience-100.mp3',
    white: 'https://assets.mixkit.co/music/preview/mixkit-white-noise-1006.mp3',
    waves: 'https://assets.mixkit.co/music/preview/mixkit-ocean-waves-loop-1245.mp3',
    piano: 'https://assets.mixkit.co/music/preview/mixkit-piano-ambient-1120.mp3'
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSound = (soundId) => {
    if (currentSound === soundId && isPlaying) {
      // Pause current sound
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      return;
    }

    // Stop any current sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setCurrentSound(soundId);
    
    // Create new audio element
    const audio = new Audio(soundFiles[soundId]);
    audio.loop = true;
    audio.volume = volume;
    
    audioRef.current = audio;
    
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentSound(null);
  };

  const togglePlayer = () => {
    setShowPlayer(!showPlayer);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        className="btn btn-secondary"
        onClick={togglePlayer}
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px'
        }}
      >
        <span>{isPlaying ? '🎵' : '🎶'}</span>
        <span>Focus Music</span>
      </button>

      {showPlayer && (
        <div className="card" style={{
          position: 'absolute',
          top: '50px',
          right: 0,
          width: '350px',
          zIndex: 1000,
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Focus Sounds</h3>
            <button 
              onClick={togglePlayer}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Volume</span>
              <span style={{ fontWeight: '600', fontSize: '14px' }}>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {sounds.map(sound => (
              <button
                key={sound.id}
                onClick={() => playSound(sound.id)}
                style={{
                  background: currentSound === sound.id && isPlaying 
                    ? sound.color 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${currentSound === sound.id && isPlaying ? sound.color : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '12px',
                  padding: '15px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: currentSound === sound.id && isPlaying ? 'white' : 'var(--text-primary)'
                }}
                onMouseEnter={(e) => {
                  if (!(currentSound === sound.id && isPlaying)) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(currentSound === sound.id && isPlaying)) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                  {sound.emoji}
                </div>
                <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                  {sound.name}
                </div>
                <div style={{ fontSize: '12px', color: currentSound === sound.id && isPlaying ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-secondary)' }}>
                  {sound.description}
                </div>
                {currentSound === sound.id && isPlaying && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10b981',
                    animation: 'pulse 1.5s infinite'
                  }} />
                )}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-primary"
              onClick={() => currentSound ? playSound(currentSound) : playSound('rain')}
              style={{ flex: 1 }}
              disabled={isPlaying}
            >
              {isPlaying ? 'Playing...' : 'Play Sound'}
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={stopSound}
              style={{ flex: 1 }}
              disabled={!isPlaying}
            >
              Stop
            </button>
          </div>

          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            background: 'rgba(59, 130, 246, 0.1)', 
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            textAlign: 'center'
          }}>
            Music helps improve focus and mask distracting noises
          </div>

          <style>
            {`
              @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.7; }
                100% { transform: scale(1); opacity: 1; }
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
};

export default FocusMusic;