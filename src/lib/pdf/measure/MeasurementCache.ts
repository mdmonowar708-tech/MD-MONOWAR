import { MeasuredQuestion } from '../types';

export class MeasurementCache {
  private cache: Map<string, MeasuredQuestion> = new Map();

  private makeKey(id: string, fontSize: number, columnWidth: number): string {
    return `${id}-${fontSize}-${columnWidth.toFixed(1)}`;
  }

  public get(id: string, fontSize: number, columnWidth: number): MeasuredQuestion | undefined {
    return this.cache.get(this.makeKey(id, fontSize, columnWidth));
  }

  public set(id: string, fontSize: number, columnWidth: number, measurement: MeasuredQuestion): void {
    this.cache.set(this.makeKey(id, fontSize, columnWidth), measurement);
  }

  public clear(): void {
    this.cache.clear();
  }
}
