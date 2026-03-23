import { flags } from '@/entrypoint/utils/targets';
import { SourcererOutput, makeSourcerer } from '@/providers/base';
import { febboxMp4Scraper } from '@/providers/embeds/febbox/mp4';
import { MovieScrapeContext, ShowScrapeContext } from '@/utils/context';

async function comboScraper(ctx: ShowScrapeContext | MovieScrapeContext): Promise<SourcererOutput> {
  const id = ctx.media.tmdbId;
  const type = ctx.media.type;
  const season = ctx.media.type === 'show' ? ctx.media.season.number : undefined;
  const episode = ctx.media.type === 'show' ? ctx.media.episode.number : undefined;

  const url = type === 'show' ? `/${type}/${id}/${season}/${episode}` : `/${type}/${id}`;

  return {
    embeds: [
      {
        embedId: febboxMp4Scraper.id,
        url,
      },
    ],
  };
}

export const showboxScraper = makeSourcerer({
  id: 'showbox',
  name: 'Showbox',
  rank: 250,
  flags: [flags.CORS_ALLOWED],
  scrapeMovie: comboScraper,
  scrapeShow: comboScraper,
});
