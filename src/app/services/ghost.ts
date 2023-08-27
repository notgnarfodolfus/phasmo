import { Injectable } from "@angular/core";

export enum Evidence {
  Emf5 = "EMF 5",
  DotsProjector = "D.O.T.S Projector",
  Ultraviolett = "Ultraviolett",
  GhostOrb = "Ghost Orb",
  GhostWriting = "Ghost Writing",
  SpiritBox = "Spirit Box",
  FreezingTemperature = "Freezing Temperature"
}

export class Behavior {
  public readonly name: string;
  public readonly evidence: Evidence | null;

  public constructor(name: string, evidence: Evidence | null = null) {
    this.name = name;
    this.evidence = evidence;
  }

  public toString(): string {
    return this.name;
  }
}

export class Ghost {
  public readonly name: string;
  public readonly evidence: Evidence[];

  public constructor(name: string, evidence: Evidence[]) {
    this.name = name;
    this.evidence = evidence;
  }

  public toString(): string {
    return this.name;
  }
}

export const Ghosts: Ghost[] = [
  { name: "Spirit", evidence: [Evidence.Emf5, Evidence.GhostWriting, Evidence.SpiritBox] },
  { name: "Wraith", evidence: [Evidence.DotsProjector, Evidence.Emf5, Evidence.SpiritBox] },
  { name: "Phantom", evidence: [Evidence.DotsProjector, Evidence.Ultraviolett, Evidence.SpiritBox] },
  { name: "Poltergeist", evidence: [Evidence.Ultraviolett, Evidence.GhostWriting, Evidence.SpiritBox] },
  { name: "Banshee", evidence: [Evidence.DotsProjector, Evidence.Ultraviolett, Evidence.GhostOrb] },
  { name: "Jinn", evidence: [Evidence.Emf5, Evidence.Ultraviolett, Evidence.FreezingTemperature] },
  { name: "Mare", evidence: [Evidence.GhostOrb, Evidence.GhostWriting, Evidence.SpiritBox] },
  { name: "Revenant", evidence: [Evidence.FreezingTemperature, Evidence.GhostOrb, Evidence.GhostWriting] },
  { name: "Shade", evidence: [Evidence.Emf5, Evidence.FreezingTemperature, Evidence.GhostWriting] },
  { name: "Demon", evidence: [Evidence.Ultraviolett, Evidence.FreezingTemperature, Evidence.GhostWriting] },
  { name: "Yurei", evidence: [Evidence.DotsProjector, Evidence.FreezingTemperature, Evidence.GhostOrb] },
  { name: "Oni", evidence: [Evidence.DotsProjector, Evidence.Emf5, Evidence.FreezingTemperature] },
  { name: "Yokai", evidence: [Evidence.DotsProjector, Evidence.GhostOrb, Evidence.SpiritBox] },
  { name: "Hantu", evidence: [Evidence.Ultraviolett, Evidence.FreezingTemperature, Evidence.GhostOrb] },
  { name: "Goryo", evidence: [Evidence.DotsProjector, Evidence.Emf5, Evidence.Ultraviolett] },
  { name: "Myling", evidence: [Evidence.Emf5, Evidence.Ultraviolett, Evidence.GhostWriting] },
  { name: "Onryo", evidence: [Evidence.FreezingTemperature, Evidence.GhostOrb, Evidence.SpiritBox] },
  { name: "The Twins", evidence: [Evidence.Emf5, Evidence.FreezingTemperature, Evidence.SpiritBox] },
  { name: "Raiju", evidence: [Evidence.DotsProjector, Evidence.Emf5, Evidence.GhostOrb] },
  { name: "Obake", evidence: [Evidence.Emf5, Evidence.Ultraviolett, Evidence.GhostOrb] },
  { name: "The Mimic", evidence: [Evidence.Ultraviolett, Evidence.FreezingTemperature, Evidence.GhostOrb, Evidence.SpiritBox] },
  { name: "Moroi", evidence: [Evidence.FreezingTemperature, Evidence.GhostWriting, Evidence.SpiritBox] },
  { name: "Deogen", evidence: [Evidence.DotsProjector, Evidence.GhostWriting, Evidence.SpiritBox] },
  { name: "Thaye", evidence: [Evidence.DotsProjector, Evidence.GhostOrb, Evidence.GhostWriting] }
];