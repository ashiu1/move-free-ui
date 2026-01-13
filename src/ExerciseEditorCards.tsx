import { useEffect, useRef } from 'react';

interface Exercise {
  description: string;
  timestamp: string; // format: hh:mm:ss-hh:mm:ss
  name_of_exercise: string;
}

interface ExerciseEditorCardsProps {
  exercises: Exercise[];
  videoUrl: string;
}

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// Convert hh:mm:ss to seconds
function timeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  return 0;
}

// Parse timestamp range (hh:mm:ss-hh:mm:ss) to start and end seconds
function parseTimestampRange(timestamp: string): { start: number; end: number } {
  const [startTime, endTime] = timestamp.split('-');
  return {
    start: timeToSeconds(startTime),
    end: timeToSeconds(endTime)
  };
}

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

function ExerciseEditorCards({ exercises, videoUrl }: ExerciseEditorCardsProps) {
  const videoId = getYouTubeVideoId(videoUrl);
  const playersRef = useRef<any[]>([]);
  const intervalsRef = useRef<(NodeJS.Timeout | null)[]>([]);

  useEffect(() => {
    if (!videoId) return;

    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayers;
    } else {
      initializePlayers();
    }

    function initializePlayers() {
      exercises.forEach((exercise, index) => {
        const { start, end } = parseTimestampRange(exercise.timestamp);
        const playerId = `player-${index}`;
        let hasStarted = false;

        if (window.YT && window.YT.Player) {
          const player = new window.YT.Player(playerId, {
            height: '315',
            width: '560',
            videoId: videoId,
            playerVars: {
              autoplay: 0,
              controls: 1,
              modestbranding: 1,
            },
            events: {
              onReady: () => {
                // When player is ready, cue to the start time
                player.cueVideoById({
                  videoId: videoId,
                  startSeconds: start
                });
              },
              onStateChange: (event: any) => {
                // When video is playing, check if we've reached the end time
                if (event.data === window.YT.PlayerState.PLAYING) {
                  // If this is the first play and we're not at the start time, seek to it
                  if (!hasStarted) {
                    const currentTime = player.getCurrentTime();
                    if (currentTime < start || currentTime >= end) {
                      player.seekTo(start, true);
                    }
                    hasStarted = true;
                  }

                  // Clear any existing interval for this player
                  if (intervalsRef.current[index]) {
                    clearInterval(intervalsRef.current[index]!);
                  }

                  // Create new interval to check playback position
                  intervalsRef.current[index] = setInterval(() => {
                    const currentTime = player.getCurrentTime();
                    // Check if we've passed or reached the end time
                    if (currentTime >= end || currentTime < start) {
                      player.seekTo(start, true);
                    }
                  }, 100);
                } else {
                  // Clear interval when not playing (paused, ended, buffering, etc.)
                  if (intervalsRef.current[index]) {
                    clearInterval(intervalsRef.current[index]!);
                    intervalsRef.current[index] = null;
                  }

                  // Reset hasStarted when video is paused or stopped
                  if (event.data === window.YT.PlayerState.PAUSED ||
                      event.data === window.YT.PlayerState.ENDED) {
                    hasStarted = false;
                  }
                }
              }
            }
          });

          playersRef.current[index] = player;
        }
      });
    }

    // Cleanup function
    return () => {
      intervalsRef.current.forEach(interval => {
        if (interval) {
          clearInterval(interval);
        }
      });
      intervalsRef.current = [];

      playersRef.current.forEach(player => {
        if (player && player.destroy) {
          player.destroy();
        }
      });
      playersRef.current = [];
    };
  }, [videoId, exercises]);

  if (!videoId) {
    return <div>Invalid YouTube URL</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {exercises.map((exercise, index) => {
        return (
          <div
            key={index}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3 style={{ marginTop: 0 }}>{exercise.name_of_exercise}</h3>

            <div style={{ marginBottom: '12px' }}>
              <div
                id={`player-${index}`}
                style={{ borderRadius: '4px', overflow: 'hidden' }}
              ></div>
            </div>

            <p><strong>Timestamp:</strong> {exercise.timestamp}</p>
            <p><strong>Description:</strong> {exercise.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export default ExerciseEditorCards;
