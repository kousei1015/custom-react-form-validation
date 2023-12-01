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

        // バリデーションルールが存在し、条件に合致しない場合、エラーメッセージを設定
        if (rules.minLength && value.length < rules.minLength.value) {
          errorsRef.current[name] = {
            message: rules.minLength.message,
          };
        } else {
          // 条件に合致する場合はエラーを削除
          delete errorsRef.current[name];
        }

        // 新しいエラーオブジェクトを生成
        const newError = { ...errorsRef.current };

        // 前回のエラーと新しいエラーを比較し、異なる場合にのみエラーステートを更新
        if (JSON.stringify(errors) !== JSON.stringify(newError)) {
          setErrors(newError);
        }

        // refにエラー情報を更新
        errorsRef.current = { ...newError };
      },
    };
  };

  return { register, errors };
};

export default useFormDumy;
