import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { TarjetaMascota } from '../../components/tarjeta-mascota/tarjeta-mascota';
import { Mascota } from '../../models/mascota';
import { MascotasApi } from '../../services/mascotas-api';
import { FavoritosStore } from '../../services/favoritos-store';
import { mensajeDeError } from '../../shared/mensaje-error';

@Component({
  imports: [TarjetaMascota],
  selector: 'app-mi-lista',
  styleUrl: './mi-lista.css',
  templateUrl: './mi-lista.html',
})
export class MiLista {
  private readonly api = inject(MascotasApi);
  readonly favoritos = inject(FavoritosStore);

  readonly mascotas = signal<Mascota[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');

  readonly favoritas = computed(() =>
    this.mascotas().filter((mascota) => this.favoritos.esFavorita(mascota.id)),
  );

  constructor() {
    this.api.listar().subscribe({
      next: (mascotas) => {
        this.mascotas.set(mascotas);
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(mensajeDeError(error));
        this.cargando.set(false);
      },
    });
  }

  alternarFavorito(id: number): void {
    this.favoritos.alternar(id);
  }
}
