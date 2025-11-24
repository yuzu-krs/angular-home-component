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
  // 画像のベースパス（毎回同じURLを書く手間を省く）
  readonly baseUrl = 'https://angular.dev/assets/images/tutorials/common';

  /**
   * 住宅データのリスト。
   * 本来は API から取得するが、チュートリアルなので静的データを使用。
   * protected にしているのは、クラス外から直接書き換えてほしくないため。
   */
  protected housingLocationList: HousingLocationInfo[] = [
    {
      id: 0,
      name: 'Acme Fresh Start Housing',
      city: 'Chicago',
      state: 'IL',
      photo: `${this.baseUrl}/bernard-hermant-CLKGGwIBTaY-unsplash.jpg`,
      availableUnits: 4,
      wifi: true,
      laundry: true,
    },
    {
      id: 1,
      name: 'A113 Transitional Housing',
      city: 'Santa Monica',
      state: 'CA',
      photo: `${this.baseUrl}/brandon-griggs-wR11KBaB86U-unsplash.jpg`,
      availableUnits: 0,
      wifi: false,
      laundry: true,
    },
    {
      id: 2,
      name: 'Warm Beds Housing Support',
      city: 'Juneau',
      state: 'AK',
      photo: `${this.baseUrl}/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg`,
      availableUnits: 1,
      wifi: false,
      laundry: false,
    },
    {
      id: 3,
      name: 'Homesteady Housing',
      city: 'Chicago',
      state: 'IL',
      photo: `${this.baseUrl}/ian-macdonald-W8z6aiwfi1E-unsplash.jpg`,
      availableUnits: 1,
      wifi: true,
      laundry: false,
    },
    {
      id: 4,
      name: 'Happy Homes Group',
      city: 'Gary',
      state: 'IN',
      photo: `${this.baseUrl}/krzysztof-hepner-978RAXoXnH4-unsplash.jpg`,
      availableUnits: 1,
      wifi: true,
      laundry: false,
    },
    {
      id: 5,
      name: 'Hopeful Apartment Group',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/r-architecture-JvQ0Q5IkeMM-unsplash.jpg`,
      availableUnits: 2,
      wifi: true,
      laundry: true,
    },
    {
      id: 6,
      name: 'Seriously Safe Towns',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/phil-hearing-IYfp2Ixe9nM-unsplash.jpg`,
      availableUnits: 5,
      wifi: true,
      laundry: true,
    },
    {
      id: 7,
      name: 'Hopeful Housing Solutions',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/r-architecture-GGupkreKwxA-unsplash.jpg`,
      availableUnits: 2,
      wifi: true,
      laundry: true,
    },
    {
      id: 8,
      name: 'Seriously Safe Towns',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/saru-robert-9rP3mxf8qWI-unsplash.jpg`,
      availableUnits: 10,
      wifi: false,
      laundry: false,
    },
    {
      id: 9,
      name: 'Capital Safe Towns',
      city: 'Portland',
      state: 'OR',
      photo: `${this.baseUrl}/webaliser-_TPTXZd9mOo-unsplash.jpg`,
      availableUnits: 6,
      wifi: true,
      laundry: true,
    },
  ];

  /**
   * すべての住宅情報を返す関数。
   * Home コンポーネントなどが画面表示用に呼び出す。
   */
  getAllHousingLocations(): HousingLocationInfo[] {
    return this.housingLocationList;
  }

  /**
   * ID に一致する住宅を 1 件だけ返す。
   * 詳細画面（detail ページ）向けのデータ取得で使う。
   *
   * @param id - 取得したい住宅のID
   * @returns HousingLocationInfo または undefined
   */
  getHousingLocationById(id: number): HousingLocationInfo | undefined {
    return this.housingLocationList.find((housingLocation) => housingLocation.id === id);
  }

  submitApplication(name: string, email: string, location: string) {
    console.log(`Application received from ${name} (${email}) for ${location}`);
  }
}
