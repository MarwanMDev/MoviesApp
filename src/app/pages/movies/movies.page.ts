import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {
  movies = [];
  currentPage = 1;
  imageBaseUrl = environment.images;
  segmentModel = 'popular';

  constructor(
    private movieService: MovieService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadMovies();
  }

  async loadMovies(event?: InfiniteScrollCustomEvent) {
    const loading = await this.loadingController.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });

    this.movieService
      .getTopRatedMovies(this.currentPage, this.segmentModel)
      .subscribe((res) => {
        setTimeout(() => {
          loading.dismiss();
          this.movies.push(...res.results);
          event?.target.complete();
        }, 500);
        if (event) {
          event.target.disabled = res.total_pages === this.currentPage;
        }
      });
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }

  segmentChanged() {
    this.movies.length = 0;
    this.currentPage = 1;
    this.loadMovies();
  }
}
