// src/app/details/details.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// あなたのプロジェクトのサービス／モデルへのパスに合わせてください
import { HousingService } from '../housing';
import { HousingLocationInfo } from '../housinglocation';

// UI ヘルパー（*ngIf 等）と Reactive Forms 用モジュールを standalone コンポーネントで使うためにインポート

import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-details',

  // standalone コンポーネントとして必要な機能（ディレクティブ／モジュール）を列挙
  // NgIf: *ngIf を使うため（今回はオプションだが慣習的に入れておく）
  // ReactiveFormsModule: FormGroup / FormControl をテンプレートで使うために必須
  standalone: true,
  imports: [ ReactiveFormsModule],

  // テンプレート内は optional chaining (?.) を多用して
  // データ読み込み前でも安全に動くようにしてあります
  template: `
    <article>
      <!-- 画像: property binding で housingLocation?.photo を参照 -->
      <img
        class="listing-photo"
        [src]="housingLocation?.photo"
        alt="Exterior photo of {{ housingLocation?.name }}"
        crossorigin
      />

      <!-- 物件の基本情報 -->
      <section class="listing-description">
        <h2 class="listing-heading">{{ housingLocation?.name }}</h2>
        <p class="listing-location">{{ housingLocation?.city }}, {{ housingLocation?.state }}</p>
      </section>

      <!-- 物件の特徴 -->
      <section class="listing-features">
        <h2 class="section-heading">About this housing location</h2>
        <ul>
          <li>Units available: {{ housingLocation?.availableUnits }}</li>
          <li>Has Wifi: {{ housingLocation?.wifi }}</li>
          <li>Has Laundry: {{ housingLocation?.laundry }}</li>
        </ul>
      </section>

      <!-- 応募フォーム（Reactive Forms を使用） -->
      <!-- ★ポイント：
            - [formGroup]="applyForm" で TS 側の FormGroup と紐付ける
            - formControlName="..." で個々の入力と FormControl を紐付ける
            - (ngSubmit)="submitApplication()" で送信時に TS のメソッドを呼ぶ（ページ再読み込み防止）
      -->
      <section class="listing-apply">
        <h2 class="section-heading">Apply now to live here</h2>

        <form [formGroup]="applyForm" (ngSubmit)="submitApplication()">
          <label for="first-name">First Name</label>
          <input id="first-name" type="text" formControlName="firstName" />

          <label for="last-name">Last Name</label>
          <input id="last-name" type="text" formControlName="lastName" />

          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" />

          <button type="submit" class="primary">Apply now</button>
        </form>
      </section>
    </article>
  `,
  styleUrls: ['./details.css'],
})
export class Details {
  /**
   * ActivatedRoute を inject() して URL パラメータ（:id）を読み取る
   * 例: URL が /details/3 なら id は "3"
   */
  route: ActivatedRoute = inject(ActivatedRoute);

  /**
   * HousingService を inject() してデータ取得や送信を行う
   * どのコンポーネントからでも inject(HousingService) で同一のサービスインスタンスにアクセス可
   */
  housingService = inject(HousingService);

  /**
   * 取得した物件データを保持（まだロードされていない可能性があるので undefined を許容）
   */
  housingLocation: HousingLocationInfo | undefined;

  /**
   * ★ Reactive FormGroup を作成
   * - 各 FormControl はテンプレートの formControlName と対応する
   * - 初期値は全て空文字 ''
   */
  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  constructor() {
    /**
     * URLパラメータから物件IDを取得
     * 
     * 例: URL が /details/3 の場合
     * - this.route.snapshot.params['id'] → "3" (文字列)
     * - parseInt(..., 10) → 3 (数値) に変換
     */
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    
    /**
     * HTTP通信で特定の物件データを取得（非同期処理）
     * 
     * 処理の流れ:
     * 1. getHousingLocationById(id)を呼び出し（Promiseを返す）
     * 2. JSON Serverから該当IDの物件データを取得
     *    → fetch(`http://localhost:3000/locations?id=${id}`)
     * 3. .then()でPromiseの結果を受け取る
     * 4. 取得したデータをhousingLocationプロパティに代入
     * 
     * タイミング:
     * - constructor実行直後: housingLocation = undefined
     * - fetch完了後（数ミリ秒後）: housingLocation = データ
     * 
     * テンプレート側の対策:
     * - housingLocation?.name のように ?. を使用
     * - データ取得前でもエラーにならない（undefined時は何も表示しない）
     */
    this.housingService
      .getHousingLocationById(housingLocationId)
      .then((housingLocation) => {
        this.housingLocation = housingLocation;
      });
  }

  /**
   * フォーム送信ハンドラ
   * - (ngSubmit) が発火したときに呼ばれる
   * - this.applyForm.value にフォームの現在値が入っている
   * - 値を取り出してサービスの submitApplication() に渡す（サービス側で送信やログ処理を行う想定）
   */
  submitApplication() {
    // 簡易バリデーション（空チェック） — 実運用ならもっと厳密にする
    const first = this.applyForm.value.firstName ?? '';
    const last = this.applyForm.value.lastName ?? '';
    const email = this.applyForm.value.email ?? '';

    if (!first || !last || !email) {
      alert('Please fill in all fields.');
      return;
    }

    // サービスに渡す（サービス側で console.log したり API 呼び出ししたりする想定）
    this.housingService.submitApplication(first, last, email);

    // 送信後の UI 更新（フォームをクリア）
    this.applyForm.reset();
    alert('Application submitted (demo).');
  }
}
