import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Camera } from 'lucide-react';

import { API_BASE_URL } from '../../env';

interface VideoData {
  videoUrl: string;
  thumbnail: string;
  title?: string;
}

function FacebookPlayer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputUrl, setInputUrl] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [error, setError] = useState('');
  const [captureMode, setCaptureMode] = useState<'download' | 'clipboard'>('clipboard');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFetchVideo = useCallback(async (url: string) => {
    setLoadingVideo(true);
    setError('');
    setVideoData(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/extract?url=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        throw new Error('Cannot get video. Please check the URL.');
      }

      const data = await response.json();
      console.log("API response:", data);
      setVideoData(data);
      setSearchParams({ url });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error occurred');
    } finally {
      setLoadingVideo(false);
    }
  }, [setSearchParams]);

  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (urlParam) {
      setInputUrl(urlParam);
      handleFetchVideo(urlParam);
    }
  }, [searchParams, handleFetchVideo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      handleFetchVideo(inputUrl.trim());
    }
  };

  const handleDownloadThumbnail = async () => {
    setLoadingThumbnail(true);

    if (videoData?.thumbnail) {
      try {
        const img = new Image();

        img.crossOrigin = "anonymous"; 
        img.src = `${API_BASE_URL}/api/proxy-image?url=${encodeURIComponent(videoData.thumbnail)}`;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            console.error("Browser does not support Canvas context.");
            return;
          }

          ctx.drawImage(img, 0, 0);

          const pngUrl = canvas.toDataURL("image/png");
          
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = 'thumbnail.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        img.onerror = () => {
          console.error("Unable to load images via Proxy. Please check the Backend.");
        };
      } catch (error) {
        console.error("Error converting thumbnail to PNG:", error);
      }
    }

    setLoadingThumbnail(false);
  };

  const captureScreenshot = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (captureMode === 'clipboard') {
      try {
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            alert('Copied to clipboard!');
          }
        });
      } catch (error) {
        console.error("Error converting thumbnail to PNG:", error);
        alert('Cannot copy to clipboard. Please try to download instead.');
      }
    } else {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `screenshot-${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <h1 className="text-center mb-4">Facebook Video Player</h1>

          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="videoUrl" className="form-label">
                    Enter Video URL
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="videoUrl"
                      placeholder="https://www.facebook.com/..."
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loadingVideo || !inputUrl.trim()}
                    >
                      {loadingVideo ? 'Loading...' : 'Load video'}
                    </button>
                  </div>
                </div>
              </form>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
            </div>
          </div>

          {videoData && (
            <>
              <div className="card mb-4">
                <div className="card-body">
                  <div className="ratio ratio-16x9 mb-3 bg-dark rounded overflow-hidden">
                    {loadingVideo ? (
                      <div className="d-flex flex-column align-items-center justify-content-center text-primary">
                        <div className="spinner-border mb-2" role="status"></div>
                        <span>Đang trích xuất dữ liệu...</span>
                      </div>
                    ) : videoData?.videoUrl ? (
                      <video
                        ref={videoRef}
                        key={videoData.videoUrl}
                        src={`${API_BASE_URL}/api/stream-video?url=${encodeURIComponent(videoData.videoUrl ?? '')}`}
                        controls
                        crossOrigin="anonymous"
                        controlsList="nodownload"
                        className="w-100 h-100"
                        preload="auto"
                        style={{ objectFit: 'contain' }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center text-secondary h-100">
                        <p className="m-0">Vui lòng nhập URL Facebook để bắt đầu xem</p>
                      </div>
                    )}
                  </div>

                  {videoData.title && (
                    <h5 className="card-title">{videoData.title}</h5>
                  )}

                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="btn btn-success"
                      onClick={handleDownloadThumbnail}
                      disabled={loadingThumbnail || !videoData.thumbnail}
                    >
                      <Download size={18} className="me-2" />
                      Download Thumbnail
                    </button>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-3">
                    <Camera size={20} className="me-2" />
                    Take video screenshot
                  </h5>

                  <div className="mb-3">
                    <label className="form-label">Capture Mode:</label>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="captureMode"
                        id="clipboardMode"
                        checked={captureMode === 'clipboard'}
                        onChange={() => setCaptureMode('clipboard')}
                      />
                      <label className="form-check-label" htmlFor="clipboardMode">
                        Copy to clipboard
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="captureMode"
                        id="downloadMode"
                        checked={captureMode === 'download'}
                        onChange={() => setCaptureMode('download')}
                      />
                      <label className="form-check-label" htmlFor="downloadMode">
                        Download
                      </label>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={captureScreenshot}
                  >
                    <Camera size={18} className="me-2" />
                    Capture Screenshot
                  </button>

                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacebookPlayer;
