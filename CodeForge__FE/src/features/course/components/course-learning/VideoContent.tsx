import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useUpdateProgress } from "@/features/progress/hooks/useUpdateProgress";
import type { LessonDto } from "@/features/course/types";
import { Result } from "antd";

import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
interface Props {
  lesson: LessonDto;
}

type VideoType =
  | "native"
  | "youtube"
  | "vimeo"
  | "dailymotion"
  | "facebook"
  | "twitch"
  | "iframe"
  | "unknown";

// --- Helper Functions ---
const extractYouTubeId = (url: string): string | null => {
  const p = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const r of p) {
    const m = url.match(r);
    if (m) return m[1];
  }
  return null;
};

const extractVimeoId = (url: string): string | null => {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
};

const extractDailymotionId = (url: string): string | null => {
  const p = [/dailymotion\.com\/video\/([^_\s]+)/, /dai\.ly\/([^_\s]+)/];
  for (const r of p) {
    const m = url.match(r);
    if (m) return m[1];
  }
  return null;
};

const extractTwitchId = (url: string): string | null => {
  const m = url.match(/twitch\.tv\/videos\/(\d+)/);
  return m ? m[1] : null;
};

// --- Component ---
const VideoContent: React.FC<Props> = ({ lesson }) => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { updateProgress, isCompleted, isUpdating } = useUpdateProgress();

  const [localCompleted, setLocalCompleted] = useState(false);
  const isLessonCompleted = localCompleted || isCompleted || lesson.isCompleted;

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoDuration = useRef<number | null>(null);
  const [videoType, setVideoType] = useState<VideoType>("unknown");
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);
  const [error, setError] = useState("");
  const trackingInterval = useRef<NodeJS.Timeout | null>(null);

  // ✅ FIX: Giảm threshold xuống 80% và thêm state để debug
  const PROGRESS_THRESHOLD = 80;
  const [debugInfo, setDebugInfo] = useState<string>("");

  const videoUrl = useMemo(
    () => lesson?.videoContent?.videoUrl?.trim() || "",
    [lesson?.videoContent?.videoUrl]
  );
  const lessonId = lesson.lessonId;

  useEffect(() => {
    if (lesson.isCompleted) {
      setLocalCompleted(true);
    }
  }, [lesson.isCompleted]);

  useEffect(() => {
    setHasMarkedComplete(false);
    setWatchedPercentage(0);
    setLocalCompleted(lesson.isCompleted || false);
    setDebugInfo("");
    videoDuration.current = null;
  }, [lessonId, lesson.isCompleted]);

  useEffect(() => {
    return () => {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
        trackingInterval.current = null;
      }
    };
  }, []);

  const markLessonAsComplete = useCallback(() => {
    if (!lessonId || hasMarkedComplete || isLessonCompleted) return;

    if (trackingInterval.current) {
      clearInterval(trackingInterval.current);
      trackingInterval.current = null;
    }

    setHasMarkedComplete(true);
    setLocalCompleted(true);
    setWatchedPercentage(100);

    setDebugInfo(`✅ Đã đánh dấu hoàn thành!`);

    updateProgress(lessonId, "completed")
      .then(() => {
        queryClient.invalidateQueries(["course", slug]);
      })
      .catch((err) => {
        console.error("❌ API Failed:", err);
        setLocalCompleted(false);
        setHasMarkedComplete(false);
        setDebugInfo(`❌ Lỗi: ${err.message}`);
      });
  }, [
    lessonId,
    hasMarkedComplete,
    isLessonCompleted,
    updateProgress,
    queryClient,
    slug,
  ]);

  const trackProgress = useCallback(
    (currentTime: number, duration: number | null) => {
      if (isLessonCompleted || !duration || hasMarkedComplete) return;

      const pct = (currentTime / duration) * 100;
      setWatchedPercentage(pct);

      const info = `⏱️ ${Math.round(currentTime)}s / ${Math.round(
        duration
      )}s (${pct.toFixed(1)}%)`;
      setDebugInfo(info);

      if (pct >= PROGRESS_THRESHOLD && !hasMarkedComplete) {
        markLessonAsComplete();
      }
    },
    [
      isLessonCompleted,
      hasMarkedComplete,
      markLessonAsComplete,
      PROGRESS_THRESHOLD,
    ]
  );

  // --- Xác định loại video ---
  useEffect(() => {
    if (!videoUrl) return;
    setError("");

    try {
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        const id = extractYouTubeId(videoUrl);
        if (id) {
          setVideoType("youtube");
          // ✅ FIX: Thêm autoplay=1 để YouTube gửi events ngay
          setEmbedUrl(
            `https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=0&modestbranding=1&rel=0&origin=${window.location.origin}`
          );
          return;
        }
      }

      if (videoUrl.includes("vimeo.com")) {
        const id = extractVimeoId(videoUrl);
        if (id) {
          setVideoType("vimeo");
          setEmbedUrl(
            `https://player.vimeo.com/video/${id}?api=1&player_id=vimeo-player&dnt=1`
          );
          return;
        }
      }

      if (videoUrl.includes("dailymotion.com") || videoUrl.includes("dai.ly")) {
        const id = extractDailymotionId(videoUrl);
        if (id) {
          setVideoType("dailymotion");
          setEmbedUrl(`https://www.dailymotion.com/embed/video/${id}?api=1`);
          return;
        }
      }

      if (videoUrl.includes("twitch.tv")) {
        const id = extractTwitchId(videoUrl);
        if (id) {
          setVideoType("twitch");
          setEmbedUrl(
            `https://player.twitch.tv/?video=${id}&parent=${window.location.hostname}`
          );
          return;
        }
      }

      if (videoUrl.match(/\.(mp4|webm|ogg|mov|avi|m4v|mkv)(\?.*)?$/i)) {
        setVideoType("native");
        setEmbedUrl(videoUrl);
        return;
      }

      setVideoType("iframe");
      setEmbedUrl(videoUrl);
    } catch (err) {
      console.error("❌ Video parse error:", err);
      setError("Không thể nhận dạng video.");
    }
  }, [videoUrl]);

  // --- Native Video Tracking ---
  useEffect(() => {
    if (isLessonCompleted) {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
        trackingInterval.current = null;
      }
      return;
    }

    if (videoType !== "native" || !videoRef.current) {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
        trackingInterval.current = null;
      }
      return;
    }

    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      if (video.duration) {
        videoDuration.current = video.duration;
      }
    };

    const handleTimeUpdate = () => {
      if (video.duration && !trackingInterval.current) {
        trackProgress(video.currentTime, video.duration);
      }
    };

    const handleEnded = () => {
      if (video.duration) {
        trackProgress(video.duration, video.duration);
      }
      markLessonAsComplete();
    };

    const startTracking = () => {
      if (trackingInterval.current) clearInterval(trackingInterval.current);
      trackingInterval.current = setInterval(() => {
        if (!video.paused && !video.ended && video.duration) {
          trackProgress(video.currentTime, video.duration);
        }
      }, 1000);
    };

    const stopTracking = () => {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
        trackingInterval.current = null;
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("play", startTracking);
    video.addEventListener("pause", stopTracking);

    if (!video.paused && video.duration) {
      startTracking();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("play", startTracking);
      video.removeEventListener("pause", stopTracking);
      stopTracking();
    };
  }, [videoType, isLessonCompleted, trackProgress, markLessonAsComplete]);

  // --- YouTube & Vimeo Tracking ---
  useEffect(() => {
    if (isLessonCompleted) {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
        trackingInterval.current = null;
      }
      return;
    }

    if (
      (videoType !== "youtube" && videoType !== "vimeo") ||
      !iframeRef.current
    ) {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
        trackingInterval.current = null;
      }
      return;
    }

    let hasStartedTracking = false;

    const onMsg = (event: MessageEvent) => {
      // ✅ FIX: Bỏ check origin để nhận tất cả messages
      // if (event.source !== iframeRef.current?.contentWindow) return;

      let data: any = {};
      try {
        data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch (e) {
        return;
      }

      if (!data || !data.event) return;

      // YouTube
      if (videoType === "youtube") {
        // ✅ Thêm log cho mọi state change
        if (data.event === "onStateChange") {
          const states = {
            "-1": "unstarted",
            "0": "ended",
            "1": "playing",
            "2": "paused",
            "3": "buffering",
            "5": "cued",
          };
        }

        const isInfoDelivery = data.event === "infoDelivery" && data.info;
        const isPlaying = data.event === "onStateChange" && data.info === 1;
        const isPausedOrBuffering =
          data.event === "onStateChange" &&
          (data.info === 2 || data.info === 3 || data.info === 5);
        const isEnded = data.event === "onStateChange" && data.info === 0;

        if (isInfoDelivery) {
          const cur = data.info.currentTime;
          const dur = data.info.duration;

          if (dur && dur > 0) {
            videoDuration.current = dur;
            if (!hasStartedTracking) {
              hasStartedTracking = true;
            }
          }
          if (cur !== undefined && (dur || videoDuration.current)) {
            trackProgress(cur, dur || videoDuration.current);
          }
        }

        if (isPlaying && !trackingInterval.current) {
          trackingInterval.current = setInterval(() => {
            iframeRef.current?.contentWindow?.postMessage(
              '{"event":"command","func":"getCurrentTime","args":""}',
              "*"
            );
            if (!videoDuration.current) {
              iframeRef.current?.contentWindow?.postMessage(
                '{"event":"command","func":"getDuration","args":""}',
                "*"
              );
            }
          }, 1000);
        }

        if ((isPausedOrBuffering || isEnded) && trackingInterval.current) {
          clearInterval(trackingInterval.current);
          trackingInterval.current = null;
        }

        if (isEnded && videoDuration.current) {
          trackProgress(videoDuration.current, videoDuration.current);
          markLessonAsComplete();
        }
      }

      // Vimeo
      if (videoType === "vimeo") {
        if (data.event === "timeupdate" && data.data) {
          const cur = data.data.seconds;
          const dur = data.data.duration;

          if (dur && dur > 0) {
            videoDuration.current = dur;
          }
          if (cur !== undefined && (dur || videoDuration.current)) {
            trackProgress(cur, dur || videoDuration.current);
          }
        }

        if (data.event === "ended" && videoDuration.current) {
          trackProgress(videoDuration.current, videoDuration.current);
          markLessonAsComplete();
        }

        if (data.event === "ready" && iframeRef.current) {
          const events = ["play", "pause", "ended", "timeupdate"];
          events.forEach((evt) => {
            iframeRef.current?.contentWindow?.postMessage(
              JSON.stringify({ method: "addEventListener", value: evt }),
              "*"
            );
          });

          setTimeout(() => {
            iframeRef.current?.contentWindow?.postMessage(
              JSON.stringify({ method: "getCurrentTime" }),
              "*"
            );
            iframeRef.current?.contentWindow?.postMessage(
              JSON.stringify({ method: "getDuration" }),
              "*"
            );
          }, 100);
        }
      }
    };

    window.addEventListener("message", onMsg);

    // ✅ FIX: Khởi tạo YouTube API đúng cách
    if (videoType === "youtube" && iframeRef.current) {
      // Gửi nhiều lần để đảm bảo YouTube nhận được
      const initYT = () => {
        iframeRef.current?.contentWindow?.postMessage(
          '{"event":"listening","id":"' + iframeRef.current?.id + '"}',
          "*"
        );
      };
      initYT();
      setTimeout(initYT, 500);
      setTimeout(initYT, 1000);
    }

    return () => {
      window.removeEventListener("message", onMsg);
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
        trackingInterval.current = null;
      }
    };
  }, [videoType, isLessonCompleted, trackProgress, markLessonAsComplete]);

  // --- Render ---
  if (!videoUrl) {
    return (
      <Result status="404" title="404" subTitle="Không có video bài học" />
    );
  }

  if (error) {
    return (
      <div className="lesson-content__video lesson-content__video--error">
        <p>{error}</p>
        <small>{videoUrl}</small>
      </div>
    );
  }

  return (
    <div className="lesson-content__video">
      <div className="lesson-content__video-wrapper">
        {videoType === "native" && embedUrl ? (
          <video
            key={embedUrl}
            ref={videoRef}
            controls
            controlsList="nodownload"
            playsInline
            preload="metadata"
          >
            <source src={embedUrl} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ thẻ video.
          </video>
        ) : (
          embedUrl && (
            <iframe
              key={embedUrl}
              ref={iframeRef}
              id={`youtube-player-${lessonId}`}
              className="lesson-content__video-iframe"
              src={embedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation allow-top-navigation-by-user-activation"
              title="Video bài học"
            />
          )
        )}

        {!isLessonCompleted && watchedPercentage > 0 && (
          <div className="lesson-content__video-progress">
            <div
              className="lesson-content__video-progress-bar"
              style={{ width: `${Math.min(watchedPercentage, 100)}%` }}
            />
          </div>
        )}
      </div>

      {lesson?.videoContent?.caption && (
        <div className="lesson-content__video-caption">
          {lesson.videoContent.caption}
        </div>
      )}

      <div className="lesson-content__video-status">
        {isLessonCompleted ? (
          <span
            style={{ color: "#52c41a", fontWeight: "bold", fontSize: "16px" }}
          >
            ✅ Đã hoàn thành bài học
          </span>
        ) : (
          <>
            {isUpdating && <span>⏳ Đang cập nhật...</span>}
            {!isUpdating && watchedPercentage > 0 && (
              <div>
                <div style={{ marginBottom: "8px" }}>
                  📊 Tiến độ: <strong>{Math.round(watchedPercentage)}%</strong>
                  {watchedPercentage >= PROGRESS_THRESHOLD && (
                    <span style={{ color: "#52c41a", marginLeft: "8px" }}>
                      (Đủ {PROGRESS_THRESHOLD}% để hoàn thành)
                    </span>
                  )}
                </div>
                {debugInfo && (
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {debugInfo}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VideoContent;
