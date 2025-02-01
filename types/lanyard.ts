type Activity = {
  flags: number;
  id: string;
  name: string;
  type: number;
  state: string;
  session_id: string;
  details: string;
  timestamps: {
    start: number;
    end: number;
  };
  assets: {
    large_image: string;
    large_text: string;
  };
  sync_id: string;
  created_at: number;
  party: {
    id: string;
  };
};

type DiscordUser = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  clan: null;
  avatar_decoration_data: null;
  bot: boolean;
  global_name: string;
  primary_guild: null;
  display_name: string;
  public_flags: number;
};

type Spotify = {
  timestamps: {
    start: number;
    end: number;
  };
  album: string;
  album_art_url: string;
  artist: string;
  song: string;
  track_id: string;
};

export type LanyardResponseData = {
  kv: {
    profile?: string;
    github?: string;
    [key: string]: unknown;
  };
  discord_user: DiscordUser;
  activities: Activity[];
  discord_status: string;
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  listening_to_spotify: boolean;
  spotify?: Spotify;
};

export type LanyardResponse = {
  data: LanyardResponseData;
  success: boolean;
};
