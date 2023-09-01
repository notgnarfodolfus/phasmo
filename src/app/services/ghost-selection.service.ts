import { Injectable } from '@angular/core';
import { Tag } from './ghost';

@Injectable({
  providedIn: 'root'
})
export class GhostSelectionService {

  private checked: Set<Tag> = new Set<Tag>();

  constructor() { }
}