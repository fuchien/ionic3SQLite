import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

// MODELS
import { Movie } from './../../models/movie/movie.model';

// SERVICES
import { SqliteHelperService } from './../sqlite-helper/sqlite-helper.service';

@Injectable()
export class MovieService {

  private db: SQLiteObject
  private isFirstCall: boolean = true

  constructor(
    public sqliteHelperService: SqliteHelperService
  ) {}

  private getDb(): Promise<SQLiteObject> {
    if (this.isFirstCall) {
      this.isFirstCall = false
      return this.sqliteHelperService.getDb(`dynamicbox.db`)
        .then((db: SQLiteObject) => {
          this.db = db
          this.db.executeSql(`CREATE TABLE IF NOT EXISTS movie (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)`, {})
            .then((success: any) => console.log(`Movie table created success: `, success))
            .catch((err: Error) => console.log(`Error creating movies table: `, err))
          return this.db
        })
    }
    return this.sqliteHelperService.getDb()
  }

  getAll(orderBy?: string): Promise<Movie[]> {
    return this.getDb()
      .then((db: SQLiteObject) => {
        return <Promise<Movie[]>>this.db.executeSql(`SELECT * FROM movie ORDER BY id ${orderBy || 'DESC'}`, {})
          .then((resultSet) => {
            let list: Movie[] = []
            for (let x=0; x<resultSet.rows.length; x++) {
              list.push(resultSet.rows.item(x))
            }
            return list
          }).catch((err: Error) => console.log(`Error executing method getAll: `, err))
      })
  }

  create(movie: Movie): Promise<Movie> {
    return <Promise<Movie>>this.db.executeSql(`INSERT INTO movie (title) VALUES (?)`, [movie.title])
      .then((resultSet) => {
        movie.id = resultSet.insertId
        return movie
      }).catch((err: Error) => console.log(`Error creating ${movie.title} movie!`, err))
  }

  update(movie: Movie): Promise<boolean> {
    return <Promise<boolean>>this.db.executeSql(`UPDATE movie SET title=? WHERE id=?`, [movie.title, movie.id])
      .then((resultSet) => resultSet.rowsAffected >= 0)
      .catch((err: Error) => console.log(`Error updating ${movie.title} movie!`, err))
  }

  delete(id: number): Promise<boolean> {
    return <Promise<boolean>>this.db.executeSql(`DELETE from movie WHERE id=?`, [id])
      .then((resultSet) => resultSet.rowsAffected > 0)
      .catch((err: Error) => console.log(`Error deleting movie with id ${id}!`, err))
  }

  getById(id: number): Promise<Movie> {
    return <Promise<Movie>>this.db.executeSql(`SELECT * FROM movie WHERE id=?`, [id])
      .then((resultSet) => resultSet.rows.item(0))
      .catch((err: Error) => console.log(`Error fetching movie with id ${id}!`, err))
  }

}
