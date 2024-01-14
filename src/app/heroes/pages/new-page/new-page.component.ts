import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Hero, Publisher } from "../../interfaces/hero.interface";
import { HeroesService } from "../../services/heroes.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { switchMap } from "rxjs";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-new-page",
  templateUrl: "./new-page.component.html",
  styles: ``
})
export class NewPageComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  private activatedRoute = inject(ActivatedRoute);
  private heroesService = inject(HeroesService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    if (!this.router.url.includes("edit")) return;

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHeroById(id)))
      .subscribe(hero => {
        if (!hero) return this.router.navigateByUrl("/");

        this.heroForm.reset(hero);
        return;
      });
  }
  public heroForm = new FormGroup({
    id: new FormControl<string>(""),
    superhero: new FormControl<string>("", { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(""),
    first_appearance: new FormControl(""),
    characters: new FormControl(""),
    alt_img: new FormControl("")
  });

  public publishers = [
    { id: "DC Comics", value: "DC - Comics" },
    { id: "Marvel Comics", value: "Marvel - Comics" }
  ];

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;

    return hero;
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe(hero => {
        this.showSnackBar(
          `El héroe ${hero.superhero} se actualizó correctamente!`
        );
      });

      return;
    }

    this.heroesService.addHero(this.currentHero).subscribe(hero => {
      this.router.navigate(["/heroes/edit", hero.id]);
      this.showSnackBar(
        `El héroe ${hero.superhero} se ha creado correctamente!`
      );
    });
    // this.heroesService.updateHero(this.heroForm.value).
  }

  onDelete(): void {
    if (
      !confirm(
        `Estás seguro/a de eliminar al héroe "${this.currentHero.superhero}"?`
      )
    )
      return;
    this.heroesService.deleteHeroById(this.currentHero).subscribe(() => {
      this.showSnackBar(`El héroe ha sido eliminado`);
      this.router.navigate(["/heroes"]);
    });
  }

  showSnackBar(message: string): void {
    this._snackBar.open(message, "done", {
      duration: 2000
    });
  }
}
