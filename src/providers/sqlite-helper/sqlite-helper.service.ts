import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class SqliteHelperService {

  private db: SQLiteObject

  constructor(
    public platform: Platform,
    private sqlite: SQLite
  ) {
  }

  private createDatebase(dbName?: string): Promise<SQLiteObject> {
    return this.platform.ready()
      .then((readySource: string) => {
        return this.sqlite.create({
          name: dbName || `dynamic.box`,
          location: `default`
        }).then((db: SQLiteObject) => {
          this.db = db
          return this.db
        }).catch((err: Error) => {
          console.log(`Error on open or create database: `, err)
          return Promise.reject(`Error on open or create database: ${err}`)
        })
      })
  }

  getDb(dbName?: string, newOpen?: boolean): Promise<SQLiteObject> {
    if (newOpen) return this.createDatebase(dbName)
    return this.db ? Promise.resolve(this.db) : this.createDatebase(dbName)
  }

}
