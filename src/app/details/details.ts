// src/app/details/details.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Service / model（あなたのプロジェクト内のファイルパスに合わせる）
import { HousingService } from '../housing';
import { HousingLocationInfo } from '../housinglocation';

// Angular 共通ユーティリティ（テンプレートで *ngIf を使う場合に必要）
import { NgIf } from '@angular/common';

// フォームの [(ngModel)] を使うために必要
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',

  // standalone コンポーネントなのでテンプレートで使うディレクティブ／モジュールを明示する
  // - NgIf: *ngIf を使うため（今回のテンプレートではオプションだが一般的に入れておく）
  // - FormsModule: [(ngModel)]（双方向バインド）と (ngSubmit) を使うために必須
  standalone: true,
  imports: [NgIf, FormsModule],

  /*

  (ngSubmit)="submitApplication()"

  フォームの送信イベントを Angular がキャッチして submitApplication() メソッドを呼び出します。

  これは通常の HTML の submit ではなく、Angular 独自の ngSubmit です。

  FormsModule をインポートしていないと ngSubmit は使えません。

  */
  /*

  [(ngModel)]="name"

  双方向データバインディングです。

  ユーザーが入力した値をコンポーネント側の name 変数に自動で反映します。

  逆にコンポーネント側で name を書き換えると、入力欄にも反映されます。

  これも FormsModule が必要です。

   */
  // template: 実際の HTML（テンプレート式のコメントは行内で説明）
  template: `
    <article>
      <!-- 画像表示
           [src] は property binding（式を評価して属性に入れる）
           ?. は optional chaining（データが undefined のときに安全に扱う）
      -->
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

      <!-- 応募フォーム（この章で追加） -->
      <!-- 注意: Angular のフォーム送信は (ngSubmit) を使うのが安全（ページリロードを防ぎ、FormDirective と連携） -->
      <section class="listing-apply">
        <h2 class="section-heading">Apply now</h2>

        <!-- (ngSubmit) を使うには FormsModule が必要。name 属性は ngModel と一緒に使う必須要素 -->
        <form (ngSubmit)="submitApplication()">
          <label for="name">Name</label>
          <input id="name" type="text" [(ngModel)]="name" name="name" />

          <label for="email">Email</label>
          <input id="email" type="email" [(ngModel)]="email" name="email" />

          <button type="submit">Submit</button>
        </form>
      </section>
    </article>
  `,
  styleUrls: ['./details.css'],
})
export class Details {
  // ActivatedRoute を inject() して URL パラメータ（:id）を読み取る
  // ActivatedRoute
  // 現在のルート情報を取得する Angular サービス。
  // 例: URL が /details/3 の場合、:id は 3。
  // inject(ActivatedRoute) でコンポーネント内で使えるようになります。
  route: ActivatedRoute = inject(ActivatedRoute);

  // HousingService を inject() してデータ取得や送信を行う
  // HousingService
  // 物件情報を取得したり、応募情報を送信するサービス。
  // これも inject(HousingService) で DI コンテナから取得します。
  // 親から渡す必要はなく、どのコンポーネントでも inject() で取得可能です。
  // 親から渡す場合は @Input() デコレーターを使います。
  housingService = inject(HousingService);

  // 取得した物件データを保持（存在しない可能性があるので undefined を許容）
  housingLocation: HousingLocationInfo | undefined;

  // フォーム入力を格納するプロパティ（テンプレートの [(ngModel)] と連動）
  name = '';
  email = '';

  constructor() {
    // 起動時に URL のパラメータから id を取り出す（'/details/:id'）
    const housingLocationId = Number(this.route.snapshot.params['id']);

    // サービスを使って ID に対応する物件を取得して保持
    // getHousingLocationById は HousingService 側で実装しておくこと
    this.housingLocation = this.housingService.getHousingLocationById(housingLocationId);
  }

  /**
   * フォーム送信ハンドラ
   * - ここでは HousingService に申請データを渡す想定
   * - 実際の処理（API 呼び出しやバリデーション、成功時のメッセージ表示など）は HousingService 側またはここで追加する
   */
  submitApplication() {
    // 簡易バリデーション（実運用ならもっと厳密に）
    if (!this.name || !this.email) {
      // ブラウザ内で簡単に通知したい場合は alert でも良いが、実装は自由
      alert('Please enter name and email.');
      return;
    }

    // サービスに送る（サービス側で送信処理 or 単にログ出力するなど）
    this.housingService.submitApplication(this.name, this.email, this.housingLocation?.name ?? '');

    // 送信後の UI 更新（例：フォームクリア、トースト表示など）
    this.name = '';
    this.email = '';
    alert('Application submitted. (This is a demo alert.)');
  }
}
