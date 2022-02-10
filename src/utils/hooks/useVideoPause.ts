import { useState, useEffect } from 'react';

import { VideoType } from '../types';

const useVideoPause = (currentVideoMgr) => {
  const [videoToResume, setVideoToResume] = useState<boolean>(false);
  const [videoPause, setVideoPause] = useState<boolean>(false);

  useEffect(() => {
    if (videoPause && currentVideoMgr && currentVideoMgr.liveOrArchived !== VideoType.Live) {
      currentVideoMgr.isPaused().then(isPaused => {
        if (!isPaused) {
          currentVideoMgr.pause();
          setVideoToResume(true);
        }
      });
    }
  }, [videoPause]);

  useEffect(() => {
    if (videoToResume && currentVideoMgr) {
      currentVideoMgr.play();
      setVideoToResume(false);
    }
  }, [videoPause]);

  return setVideoPause;
};

export default useVideoPause;
