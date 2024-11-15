/* globals Notice, request, requestUrl, moment */

import { HowLongToBeatService } from 'howlongtobeat';
import { source } from 'common-tags';

const hltbService = new HowLongToBeatService();
const notice = (msg) => new Notice(msg, 5000);
const noticeAndThrow = (msg, cause) => {
  notice(msg);
  throw new Error(msg, { cause });
};

let app;
let quickAddApi;

module.exports = {
  entry: start,
  settings: {
    name: 'HLTB Script',
    author: 'akatopo',
    options: {},
  },
};

async function start(params, settings) {
  ({ app, obsidian, quickAddApi } = params);

  const activeFile = app.workspace.getActiveFile();
  if (!activeFile) {
    notice('No active file', 5000);
    return;
  }

  let titleFromFrontmatter;
  try {
    await app.fileManager.processFrontMatter(activeFile, (fm) => {
      titleFromFrontmatter = fm.title;
    });
  } catch (error) {
    // ignored
  }
  const queryPlaceholders = ["Baldur's Gate 3", 'Portal', 'Melvor Idle'];
  const queryPlaceholder =
    queryPlaceholders[
      Math.floor(Math.random() * (queryPlaceholders.length - 1))
    ];

  const query =
    titleFromFrontmatter ??
    (await quickAddApi.inputPrompt(
      'Enter video game title: ',
      `ex. ${queryPlaceholder}`,
      '',
    ));

  if (!query) {
    notice('No query entered. Aborting');
    return;
  }

  const searchResults = await executeQuery(query);

  if (!Array.isArray(searchResults) || searchResults.length === 0) {
    notice('No results found. Aborting');
    return;
  }

  const selectedGame =
    searchResults.length === 1
      ? searchResults[0]
      : await quickAddApi.suggester(
          searchResults.map(
            ({ platforms, name: title, releaseYear: released }) =>
              formatTitleForSuggestion({ title, platforms, released }),
          ),
          searchResults,
        );

  if (!selectedGame) {
    notice('No choice selected. Aborting');
    return;
  }

  const game = await hltbService.detail(selectedGame.id);

  try {
    await app.fileManager.processFrontMatter(activeFile, (fm) => {
      for (const [key] of game?.timeLabels ?? []) {
        fm[key] = game[key];
      }
      fm.hltbId = game.id;
      fm.hltbUrl = `https://howlongtobeat.com/game/${game.id}`;
      fm.hltbPoster = game.imageUrl;
    });
  } catch (error) {
    // ignored
    notice(
      `Error when trying to write hltb properties into frontmatter: ${error.toString()}`,
    );
  }

  return `\n${createHltbTableMarkdown(game?.timeLabels, game)}`;
}

function createAvgTimeText(time) {
  const fmt = new Intl.NumberFormat('en-US');
  const [integer, , fraction] = fmt.formatToParts(time);

  // This will break with minutes/extremely short games
  return `${integer.value}${fraction?.value === '5' ? '½' : ''} hour${
    integer.value > 1 ? 's' : ''
  }`;
}

function createHltbTableMarkdown(timeLabels = [], game) {
  const rows = timeLabels.map(
    ([key, label]) => `| ${label} | ${createAvgTimeText(game[key])} |`,
  );

  return source`
    ## How long to beat

    | Playstyle | Average time |
    | --- | --- |
    ${rows}
  `;
}

async function executeQuery(query) {
  try {
    return await hltbService.search(query);
  } catch (error) {
    noticeAndThrow('Failed to fetch game results.', { cause: error });
  }
}

function formatTitleForSuggestion({ title, released, platforms = '' }) {
  const platformsStr = ` [${platforms.join(', ')}]`;
  const releaseYear = released;
  return `${title}${
    typeof releaseYear === 'number' ? ` (${releaseYear})` : ''
  }${platforms.length > 0 ? platformsStr : ''}`;
}
