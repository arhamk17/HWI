const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const inputVideo = 'C:\\Users\\Arham Khan\\Downloads\\1016.mp4';
const outputBase = path.join(__dirname, '..', 'public', 'videos', 'intro-hls');

console.log('Input video:', inputVideo);
console.log('Output directory:', outputBase);

const renditions = [
  {
    name: '1080p',
    resolution: '1920x1080',
    vf: 'scale=w=1920:h=1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2',
    fps: 60,
    gop: 120, // 2 seconds @ 60fps
    videoBitrate: '4500k',
    maxrate: '5000k',
    bufsize: '9000k',
    audioBitrate: '192k',
    profile: 'high',
    level: '4.2',
  },
  {
    name: '720p',
    resolution: '1280x720',
    vf: 'scale=w=1280:h=720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2',
    fps: 60,
    gop: 120,
    videoBitrate: '2400k',
    maxrate: '2800k',
    bufsize: '5000k',
    audioBitrate: '128k',
    profile: 'main',
    level: '4.0',
  },
  {
    name: '480p',
    resolution: '854x480',
    vf: 'scale=w=854:h=480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2',
    fps: 30,
    gop: 60, // 2 seconds @ 30fps
    videoBitrate: '900k',
    maxrate: '1100k',
    bufsize: '2000k',
    audioBitrate: '96k',
    profile: 'main',
    level: '3.1',
  },
];

for (const r of renditions) {
  const rendDir = path.join(outputBase, r.name);
  if (!fs.existsSync(rendDir)) {
    fs.mkdirSync(rendDir, { recursive: true });
  }

  const segmentFilename = path.join(rendDir, 'seg-%03d.ts');
  const playlistFilename = path.join(rendDir, 'index.m3u8');

  console.log(`\n========================================`);
  console.log(`Encoding rendition: ${r.name} (${r.resolution} @ ${r.fps}fps)`);
  console.log(`========================================`);

  const cmd = [
    'ffmpeg',
    '-y',
    '-i', `"${inputVideo}"`,
    '-vf', `"${r.vf}"`,
    '-r', r.fps,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-profile:v', r.profile,
    ...(r.level ? ['-level', r.level] : []),
    '-b:v', r.videoBitrate,
    '-maxrate', r.maxrate,
    '-bufsize', r.bufsize,
    '-g', r.gop,
    '-keyint_min', r.gop,
    '-sc_threshold', '0',
    '-c:a', 'aac',
    '-b:a', r.audioBitrate,
    '-ar', '48000',
    '-hls_time', '4',
    '-hls_playlist_type', 'vod',
    '-hls_flags', 'independent_segments',
    '-hls_segment_type', 'mpegts',
    '-hls_segment_filename', `"${segmentFilename}"`,
    `"${playlistFilename}"`
  ].join(' ');

  console.log('Executing:', cmd);
  execSync(cmd, { stdio: 'inherit' });
  console.log(`Finished ${r.name}`);
}

// Generate master playlist
const masterContent = `#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=4800000,AVERAGE-BANDWIDTH=4692000,RESOLUTION=1920x1080,FRAME-RATE=60.000,CODECS="avc1.64002a,mp4a.40.2"
1080p/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=2600000,AVERAGE-BANDWIDTH=2528000,RESOLUTION=1280x720,FRAME-RATE=60.000,CODECS="avc1.4d4028,mp4a.40.2"
720p/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=1050000,AVERAGE-BANDWIDTH=996000,RESOLUTION=854x480,FRAME-RATE=30.000,CODECS="avc1.4d401f,mp4a.40.2"
480p/index.m3u8
`;

const masterPath = path.join(outputBase, 'master.m3u8');
fs.writeFileSync(masterPath, masterContent.trim() + '\n', 'utf8');
console.log('\nWrote master playlist to:', masterPath);
console.log('HLS generation complete!');
