import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Uploader.css';

function Uploader() {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setError('');
    // Navigate to Editor with the URL
    navigate('/editor', { state: { url } });
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUrl(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="uploader">
      <h2>Upload YouTube Video</h2>
      <form onSubmit={handleSubmit} className="uploader-form">
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter YouTube URL"
            className={`url-input ${error ? 'error' : ''}`}
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
        {error && <span className="error-message">{error}</span>}
      </form>
    </div>
  );
}

export default Uploader;
