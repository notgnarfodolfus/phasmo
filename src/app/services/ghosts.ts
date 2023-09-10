import * as raw from '../../assets/ghosts.json';

import { Ghost, GhostFilters, GhostName, GhostModel } from './models';

class DeogenGhost extends Ghost {

  public override isPossible(filters: GhostFilters): boolean {
    return super.isPossible(filters);
  }
}

class HantuGhost extends Ghost {

  public override isPossible(filters: GhostFilters): boolean {
    return super.isPossible(filters);
  }
}

const GhostImplementations: { [key: string]: typeof Ghost } = {
  "": Ghost, // default
  "Deogen": DeogenGhost,
  "Hantu": HantuGhost
}

function createGhosts(): { [key in GhostName]: Ghost } {
  const lookup: { [key in GhostName]?: Ghost } = {};
  Object.entries(raw as { [name: string]: GhostModel })
    .filter(e => e[0] !== 'default') // Skip over JSON import fragmet
    .forEach(e => {
      const name = GhostName[e[0] as keyof typeof GhostName] ?? e[0] as GhostName;
      const cls = GhostImplementations[name] ?? Ghost;
      lookup[name] = new cls(name, e[1]);
    });
  return lookup as { [key in GhostName]: Ghost };
}

export const Ghosts = createGhosts();
