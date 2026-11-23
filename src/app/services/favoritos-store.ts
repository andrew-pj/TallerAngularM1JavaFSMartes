import { Service, computed, signal } from '@angular/core';

@Service()
export class FavoritosStore {
  private readonly idsPrivados = signal<number[]>([]);

  readonly ids = this.idsPrivados.asReadonly();
  readonly total = computed(() => this.ids().length);

  alternar(id: number): void {
    this.idsPrivados.update((ids) =>
      ids.includes(id) ? ids.filter((actual) => actual !== id) : [...ids, id],
    );
  }

  esFavorita(id: number): boolean {
    return this.ids().includes(id);
  }
}
