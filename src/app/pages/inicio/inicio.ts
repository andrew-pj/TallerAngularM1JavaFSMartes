import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TarjetaMascota } from '../../components/tarjeta-mascota/tarjeta-mascota';
import { Mascota } from '../../models/mascota';
import { MascotasApi } from '../../services/mascotas-api';
import { FavoritosStore } from '../../services/favoritos-store';
import { mensajeDeError } from '../../shared/mensaje-error';

@Component({
  imports: [RouterLink, TarjetaMascota],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  private readonly api = inject(MascotasApi);
  readonly favoritos = inject(FavoritosStore);

  readonly destacados = signal<Mascota[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');

  constructor() {
    this.api.listar().subscribe({
      next: (mascotas) => {
        this.destacados.set(mascotas.filter((mascota) => !mascota.adoptada).slice(0, 3));
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
