import { Injectable } from '@angular/core';
import { HousingLocationInfo } from './housinglocation';


/**
 * HousingService は、アプリ内で使用される住宅データを管理するサービスです。
 * Angular の依存性注入（DI）によって、どのコンポーネントからでも利用できます。
 */
@Injectable({
  providedIn: 'root', // アプリ全体で 1 つのインスタンスが共有される
})
export class HousingService {
  /**
   * JSON ServerのエンドポイントURL
   * - JSON Serverは db.json のデータを REST API として公開
   * - /locations エンドポイントで全物件データにアクセス可能
   * 
   * 起動方法: json-server --watch db.json
   * アクセス例: http://localhost:3000/locations
   */
  url = 'http://localhost:3000/locations';
  
  /**
   * HTTP通信：全ての住宅データを取得
   * 
   * @returns Promise<HousingLocationInfo[]> - 物件データの配列を返すPromise
   * 
   * 処理の流れ:
   * 1. async: この関数は非同期（Promiseを返す）
   * 2. await fetch(this.url): HTTP GETリクエストを送信し、レスポンスを待つ
   *    → ブラウザ標準のfetch API使用（外部ライブラリ不要）
   * 3. await data.json(): レスポンスをJSON形式にパース
   * 4. ?? []: もしデータがnull/undefinedなら空配列を返す（フォールバック）
   * 
   * 呼び出し側の使用例:
   * this.housingService.getAllHousingLocations()
   *   .then(data => console.log(data));
   */
  async getAllHousingLocations(): Promise<HousingLocationInfo[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }

  /**
   * HTTP通信：特定IDの住宅データを取得
   * 
   * @param id - 取得したい物件のID
   * @returns Promise<HousingLocationInfo | undefined> - 該当物件データを返すPromise
   * 
   * 処理の流れ:
   * 1. fetch(`${this.url}?id=${id}`): クエリパラメータでIDを指定
   *    例: http://localhost:3000/locations?id=3
   * 2. await data.json(): レスポンス（配列形式）をパース
   *    JSON Server は ?id=3 の結果を配列で返す → [{ id: 3, ... }]
   * 3. locationJson[0]: 配列の最初の要素（該当データ）を取得
   * 4. ?? {}: データがなければ空オブジェクトを返す
   * 
   * 注意: JSON Serverのクエリは配列を返すため、[0]でアクセスが必要
   */
  async getHousingLocationById(id: number): Promise<HousingLocationInfo | undefined> {
    const data = await fetch(`${this.url}?id=${id}`);
    const locationJson = await data.json();
    return locationJson[0] ?? {};
  }

  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(
      `Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`,
    );
  }
}
