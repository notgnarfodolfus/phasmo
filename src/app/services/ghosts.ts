import * as rawTags from '../../assets/tags.json';
import * as rawGhosts from '../../assets/ghosts.json';

import { Ghost, GhostName, GhostModel, TagData, TagModel } from './models';

const GhostImplementations: { [key: string]: typeof Ghost } = {};

function createTags(): { [key: string]: TagData } {
  const raw = Object.entries(rawTags as { [name: string]: TagModel }).filter(e => e[0] !== 'default'); // Skip over JSON import fragment
  const lookup: { [key: string]: TagData } = {};
  raw // The lookup will only include base tags, no opposites...
    .filter(e => e[1].opposite == null)
    .forEach(e => (lookup[e[0]] = new TagData(e[0], e[1])));
  raw // Now opposites are assigned
    .filter(e => e[1].opposite != null)
    .forEach(e => {
      const op = new TagData(e[0], e[1]);
      const base = lookup[e[1].opposite!];
      op.opposite = base;
      base.opposite = op;
    });
  return lookup;
}

function createGhosts(): { [key in GhostName]: Ghost } {
  const lookup: { [key in GhostName]?: Ghost } = {};
  Object.entries(rawGhosts as { [name: string]: GhostModel })
    .filter(e => e[0] !== 'default') // Skip over JSON import fragment
    .forEach(e => {
      const name = GhostName[e[0] as keyof typeof GhostName] ?? (e[0] as GhostName);
      const cls = GhostImplementations[name] ?? Ghost;
      lookup[name] = new cls(name, e[1]);
    });
  return lookup as { [key in GhostName]: Ghost };
}

export const Tags = createTags();
export const Ghosts = createGhosts();
