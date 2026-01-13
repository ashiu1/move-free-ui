import { useLocation } from 'react-router-dom';
import { usePostFitnessVideo, useExerciseData } from './api/ExerciseReactQuery.ts';
import ExerciseEditorCards from './ExerciseEditorCards.tsx';

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

function Editor() {
  const location = useLocation();
  const url = location.state?.url || '';
  const videoId = getYouTubeVideoId(url);

  const { data, isLoading, error } = usePostFitnessVideo(url);

  return (
    <div className="editor">
      <h2>Video Editor</h2>
      {url && (
        <div>
          {videoId && (
            <div style={{ marginBottom: '20px' }}>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                style={{ border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <p>YouTube URL: {url}</p>

          {isLoading && <p>Loading exercise data...</p>}

          {error && <p>Error loading data: {error.message}</p>}

          {data && data.exercises && (
            <div>
              <h3>Exercise Data:</h3>
              <ExerciseEditorCards exercises={data.exercises} videoUrl={url} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Editor;
