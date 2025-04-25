/**
 * Service for fetching song lyrics
 * Supports both local lyrics and external API integration
 */

export interface LyricsSearchParams {
  title?: string;
  artist?: string;
  album?: string;
}

interface LyricsAPIConfig {
  apiKey?: string;
  baseUrl?: string;
}

// This can be configured later with actual API credentials
let apiConfig: LyricsAPIConfig = {};

export const configureLyricsAPI = (config: LyricsAPIConfig) => {
  apiConfig = config;
};

/**
 * Fetch lyrics for a given song
 * Tries external API first, falls back to local generation
 */
export const fetchLyrics = async (params: LyricsSearchParams): Promise<string | null> => {
  if (!params.title || !params.artist) {
    console.warn("Cannot search for lyrics without title and artist");
    return null;
  }

  try {
    // First attempt: Try external API if configured
    if (apiConfig.apiKey && apiConfig.baseUrl) {
      // TODO: Implement external API call here
      // Example integration point for services like Musixmatch, Genius, etc.
      // return await fetchFromExternalAPI(params);
    }

    // Fallback: Generate placeholder lyrics
    return generateLyrics(params.title, params.artist);
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return null;
  }
};

/**
 * Generate some placeholder lyrics based on song title and artist
 * This is just for demonstration purposes
 */
const generateLyrics = (title: string, artist: string): string => {
  const templates = [
    `[Verse 1]
I've been thinking about ${title}
The way you make me feel inside
${artist} on my mind day and night
Can't get enough of this feeling so right

[Chorus]
${title}, ${title}
You're all I need, all I see
${title}, oh ${title}
With ${artist} we're meant to be

[Verse 2]
The days go by, but the feeling stays
In my heart, in so many ways
${artist} showed me what it means
To live a life beyond my dreams`,

    `[Intro]
${title} - ${artist}

[Verse]
Walking through the empty streets
Thinking about all that could be
${title} in my head again and again
Wondering if this feeling will ever end

[Chorus]
Oh, ${title}
The way you move me
${artist} knows the truth
We're destined to be

[Bridge]
In the darkness I find light
${artist} by my side, holding tight
${title} is all I see
All I'll ever need`,

    `[Verse 1]
The morning sun breaks through my window
As I think about ${title} once more
${artist} playing on the radio
Taking me back to days before

[Pre-Chorus]
And I wonder if you feel the same
If ${title} still means what it did then
${artist} singing our song

[Chorus]
${title}, sweet ${title}
The memories we made
With ${artist} as our guide
I hope they never fade`
  ];
  
  // Pick a random template
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return randomTemplate;
};
