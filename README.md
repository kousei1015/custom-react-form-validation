# custom-react-form-validation

先日、React Hook Form というライブラリを使用するうちに、input タグなどにつける「...register()」この記述について気になるようになりました。そのため、そのコードを調べ、ついでに、非常に簡素ではありますが、React Hook Form を真似たカスタムフックを作ってみました。

## 注意
React Hook Form を真似たカスタムフックを作ったとはいえ、もちろん、React Hook Form のごくごく一部の機能を再現したものにすぎません。具体的には

1. register 関数と errors オブジェクトのみ再現
2. onChange イベントが走る場合のみにバリデーションが行われます。つまり、React Hook Form でいうところの'onChange'モードしか実装されおらず、'onBlur'モードなどは実装していません。
3. 設定できるバリデーションに関しては minLength のみです。(実際のReact Hook Form は他にも maxLength や reqired など、様々なバリデーションルールを設定できます)

ちなみに、なぜ、minLength のみ設定できるようにしたかと言われれば、単に私が最も多用するバリデーションルールだからです。深い意味はありません。

以下が、react-hook-form を真似たカスタムフックのコードです。
```
import React, { useRef, useState } from "react";

// バリデーションルールの型定義
type Rules = {
  minLength?: { value: number; message: string };
};

// エラーオブジェクトの型定義
type Errors = Record<string, { message: string }>;

// フィールドの型定義
type FieldsType = Record<string, { value: string; rules: Rules }>;

const useFormDumy = () => {
  // フィールドの状態を保持する useRef
  const fields = useRef<FieldsType>({});

  // エラーオブジェクトを保持する useRef
  const errorsRef = useRef<Errors>({});

  // エラー状態を保持する useState
  const [errors, setErrors] = useState<Errors>({});

  // フィールドを登録する register 関数
  const register = (name: string, rules: Rules) => {
    // フィールドの状態を保持する useRef
    fields.current[name] = { value: "", rules };

    return {
      name,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        
        // バリデーションルールが存在し、かつ条件に違反する場合、エラーメッセージを設定
        if (rules.minLength && value.length < rules.minLength.value) {
          errorsRef.current[name] = {
            message: rules.minLength.message,
          };
        } else {
          // 条件に違反しない場合はエラーを削除
          delete errorsRef.current[name];
        }

        // 前回のエラーと新しいエラーを比較し、異なる場合にのみエラーステートを更新
        if (JSON.stringify(errors) !== JSON.stringify(errorsRef.current)) {
          setErrors({ ...errorsRef.current });
        }
      },
    };
  };

  return { register, errors };
};

export default useFormDumy;
```

上記のカスタムフックは、以下のように使います。

```
import useFormDumy from "./hooks/useFormDummy";

const App = () => {
  const { register, errors } = useFormDumy();

  console.log("Componentがレンダリングされました");

  return (
    <>
      <input
        type="text"
        placeholder="文字を3文字以上入力して"
        {...register("example1", {
          minLength: { value: 3, message: "3文字以上入力してください" },
        })}
      />
      {errors?.example1 && <p>{errors.example1.message}</p>}

      <input
        type="text"
        placeholder="文字を3文字以上入力して"
        {...register("example2", {
          minLength: { value: 3, message: "3文字以上入力してください" },
        })}
      />
      {errors?.example2 && <p>{errors.example2.message}</p>}
    </>
  );
};

export default App;
```

では、「...register()」関数についての説明をしていきます。

- 「...register()」関数はどのような働きをしているのか?
「...register()」というのはReact Hook Formを使用する際に頻繁に使いますが、別にReact Hook Formをインストールしなくても、「...関数名()」という関数は渡すことができます。例えば、inputタグ内に「...関数名()」このように書くことで、その要素に新しいプロパティやイベントハンドラをつけることが可能です。言葉で説明してもわかりにくいと思うので、簡単な例を載せます。
```
import React from 'react';

const Form = () => {
  const detectChange = () => {
    return {
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value)
      }
    }
  }

  return (
    <form>
      <input type="text" {...detectChange()} />
    </form>
  );
}

export default Form;
```
inputタグに上記のように関数を渡すことで、実際にinputタグのvalueが変更されるたびに、つまりユーザーがinputタグに文字を入力するたびに、その文字列をログに表示してくれます。つまり、「...関数名()」という形でinputタグに関数を渡すことで、その要素に新しいプロパティ(例えばnameやvalueなどのプロパティ)やイベントハンドラ(onChangeやonBlurなどのイベントハンドラ)をつけることが可能と言う訳です。私もregister関数を通してイベントハンドラをつけており、これにより非制御コンポーネントではありますが、再レンダリングの回数を最適化しています。