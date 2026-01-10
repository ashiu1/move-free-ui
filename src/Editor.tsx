import { useLocation } from 'react-router-dom';
import { usePostFitnessVideo, useExerciseData } from './api/ExerciseReactQuery.ts';

function Editor() {
  const location = useLocation();
  const url = location.state?.url || '';

  const { data, isLoading, error } = usePostFitnessVideo(url);

  return (
    <div className="editor">
      <h2>Video Editor</h2>
      {url && (
        <div>
          <p>YouTube URL: {url}</p>

          {isLoading && <p>Loading exercise data...</p>}

          {error && <p>Error loading data: {error.message}</p>}

          {data && (
            <div>
              <h3>Exercise Data:</h3>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Editor;
