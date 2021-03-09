const config = {
  screens: {
    VideoPlayback: {
      path: 'play/:video_url',
      parse: {
        video_url: (video_url) => `${video_url}`,
      },
    },
  },
};

const linking = {
  prefixes: ['https://teleplayer.com', "teleplayer://app"],
  config,
};

export default linking;
