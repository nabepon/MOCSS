![MOCSS](./logo.png)

# Overview
MOCSS（モックス）は、CSS Modules、BEM、SMACSSに影響を受けて作られた、コンポーネント志向のCSS設計です。  
コンポーネントが持つ保護と再利用という2つの性質を分けることで、強固さと柔軟さを兼ね備えているのが特徴です。 


# Background
BEMやSMACSSといった様々なCSS設計があります。  
これらはCSSに秩序を与える素晴らしいものですが、いくつか不満を感じていました。  
BEMは命名が冗長だったり、SMACSSはあまり強固ではないといった点です。  

そんなおり、CSS Modulesを使ったところBEMやSMACSSに感じた不満はなく、使い心地はとても良いものでした。  
しかしWebpackとJSXを前提としているため、採用できるプロジェクトが限られるという課題がありました。  

またCSS Modulesを使ってみて感じたのは、私が過去に考え実践したCSS設計に似ていることでした。  
それは結構うまくいったのですが、他では見られない設計だったので共有しておくべきだと思い立ち、  
強固さと柔軟さを兼ね備えた**MOCSS**として再構築しました。  


# Feature

Componentと聞いて私たちが期待するのは以下の2点かと思います。

* スタイルが閉じていて安全であること
* 再利用可能な一つの塊であること

しかしCSS Modulesを使っていて思ったのは「**少し変えれば再利用可能**である」というパターンが
実際には多く、再利用可能にしようとすると**閉じたスタイルの一部を外に解放**しないといけません。  
つまり何が言いたいかというと、この2つは相反する性質だということです。

この課題を解決するためのアイデアとして、上記の性質を別々にしてしまい、
コンポーネントに差異が出ることを前提とした設計を行うことで生まれたのがMOCSSです。  
したがって、MOCSSは**コンポーネントの差異に強い**という特徴を持っています。  


# Required
SASS（またはnested, import, mixin, include）を使用することが前提の設計です。  
またSASSに限らず、CSSプリプロセッサが使える環境であれば適用可能です。  


# Idea
MOCSSでは、以下の5つの基本原則を押さえる必要があります。  

* Common
* Model
* Package
* Component
* Page 

## Common
**Common** は**サイト全体に影響を与えるスタイル**の集まりです。  
とにかく全体に影響のあるものは必ずcommonにぶち込み、common外に漏らさないことが原則です。  

## Model
**Model** は共通部品で、**不変なスタイルの塊**です。  
とにかく再利用するスタイルは全てModelとして抽象化していきます。  
再利用を妨げる微妙なスタイル差異や、他に影響を与えるmargin等は排除することが原則です。  
このModelが強固さと柔軟さを与えているので、ModelのMoをとってMOCSSと名付けています。  

## Package
**Package** は画面グループの名前空間で、class名の影響範囲を閉じ込めます。  
MOCSSでは、ページ毎にPackageを指定し、Package単位でスタイルを書いていくのが原則です。  

## Component
**Component** はmixinとして定義したModelの実体化を担います。  
また文脈によって生じるModelとの差異や、Package固有の調整などによるバリエーション増加を引き受けます。   
Packageクラス直下の要素は、必ず何かのComponentに属するようにするのが原則です。  

## Page
**Page** は画面固有の名前空間で、classの詳細度を強めます。  
それによって、PackageやComponentでは対応しきれない画面固有のスタイル調整を引き受けます。  
画面固有の名前空間なので、サイト全体で一意になるようにclass名を付けるのが原則です。

## コード例

Common
```scss
// 共通の変数やスタイルはcommon配下に配置
$fontSizeS: 12px;
$fontSizeL: 16px;
*{ margin: 0; }
```

Model
```scss
// 共通のパーツをmixinとして定義

@mixin articleCardModel(){
  .title{
    font-size: $fontSizeL;
  }
  .summary{
    font-size: $fontSizeS;
  }
}

@mixin articleCardsModel(){
  .card-S{
    @include articleCardModel;
    width: (100%/3);
    margin-top: 8px;
  }
  .card-L{
    @include articleCardModel;
    width: (100%/2);
    margin-top: 8px;
  }
}
```

PackageとComponentとPage
```scss
// xxxPackageという名前で囲い、中にComponentを定義
.topPackage{

  // Componentでは、文脈によって生じる調整やPackage固有のスタイルなどをあてる
  .articleCardsComponent{
    @include articleCardsModel;
    margin-top: 8px;
    padding: 0 8px; 
  }
  
  // 画面固有のスタイル調整は、xxxPageで定義してComponentのスタイルを上書きする
  &.articlesPage{
    .articleCardsComponent{
      margin-top: 16px;
    }
  }
}
```

Html
```html
<!-- bodyなど、rootに相当する要素に使いたいpackageを指定 -->
<body class="topPackage topPage">
  <div class="articleCardsComponent">
    <ul>
    <li class="card-S"></li>
    <li class="card-S"></li>
    <li class="card-S"></li>
    <li class="card-L"></li>
    <li class="card-L"></li>
    </ul>
  </div>
</body>
```

```html
<!-- 個別にスタイル調整するには、xxxPageを指定してpackageのスタイルを上書き -->
<body class="topPackage articlesPage">
  <div class="articleCardsComponent">...</div>
</body>
```

# Example
近日中に、簡単なサンプルコードを用意します。  