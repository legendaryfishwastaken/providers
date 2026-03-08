import { flags } from '@/entrypoint/utils/targets';
import { makeEmbed } from '@/providers/base';
import { NotFoundError } from '@/utils/errors';

import { femboxBase, parseInputUrl } from './common';

interface FemboxResponse {
  hls?: string;
}

export const febboxMp4Scraper = makeEmbed({
  id: 'febbox-mp4',
  name: 'Fembox',
  rank: 190,
  flags: [flags.CORS_ALLOWED],
  async scrape(ctx) {
    const { type, id, season, episode } = parseInputUrl(ctx.url);

    let apiUrl: string;
    if (type === 'movie') {
      apiUrl = `${femboxBase}/hls/movie/${id}`;
    } else if (type === 'show') {
      if (season === undefined || episode === undefined)
        throw new Error('Season and episode are required for TV show streams');
      apiUrl = `${femboxBase}/hls/tv/${id}/${season}/${episode}`;
    } else {
      throw new Error(`Invalid media type: expected "movie" or "show"`);
    }

    const result = await ctx.proxiedFetcher<FemboxResponse>(apiUrl);

    if (!result.hls) throw new NotFoundError('No stream found');

    ctx.progress(90);

    return {
      stream: [
        {
          id: 'primary',
          type: 'hls',
          playlist: result.hls,
          flags: [flags.CORS_ALLOWED],
          captions: [],
        },
      ],
    };
  },
});
