import { Component } from '@angular/core';
import { NavController, ItemSliding, AlertOptions, Loading, LoadingController, AlertController } from 'ionic-angular';

// MODELS
import { Movie } from './../../models/movie/movie.model';

// SERVICES
import { MovieService } from './../../providers/movie/movie.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  movies: Movie[] = []

  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private movieService: MovieService
  ) {

  }

  ionViewDidLoad(): void{
    this.movieService.getAll()
      .then((movies: Movie[]) => [
        this.movies = movies
      ])
  }

  onSave(type: string, item?: ItemSliding, movie?: Movie): void {
    let title: string = type.charAt(0).toUpperCase() + type.substr(1)
    this.showAlert({
      itemSliding: item,
      title: `${title} movie`,
      type: type,
      movie: movie
    })
  }

  onDelete(movie: Movie): void {
    this.alertCtrl.create({
      title: `Do you want to delete ${movie.title} movie?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            let loading: Loading = this.showLoading(`Deleting '${movie.title}'...`)
            this.movieService.delete(movie.id)
              .then((deleted: boolean) => {
                if (deleted) {
                  this.movies = this.movies.filter((mov: Movie) => mov !== movie)
                }
                loading.dismiss()
              })
          }
        },
        'No'
      ]
    }).present()
  }

  private showAlert(options: {itemSliding?: ItemSliding, title: string, type: string, movie?: Movie}): void {
    let alertOptions: AlertOptions = {
      title: options.title,
      inputs: [
        {
          name: 'title',
          placeholder: 'Movie title'
        }
      ],
      buttons: [
        'Cancel',
        {
          text: 'Save',
          handler: (data) => {
            let loading: Loading = this.showLoading(`Saving ${data.title} movie...`)
            let contextMovie: Movie

            switch (options.type) {
              case 'create':
                contextMovie = new Movie(data.title)
                break;
              case 'update':
                options.movie.title = data.title
                contextMovie = options.movie
                break;
            }
            this.movieService[options.type](contextMovie)
              .then((result: any) => {
                if (options.type === 'create') this.movies.unshift(result)
                loading.dismiss()
                if (options.itemSliding) options.itemSliding.close()
              })
          }
        }
      ]
    }

    if (options.type === 'update') {
      alertOptions.inputs[0]['value'] = options.movie.title
    }

    this.alertCtrl.create(alertOptions).present()
  }

  private showLoading(message?: string): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: message || 'Please wait...'
    })
    loading.present()
    return loading
  }

}
