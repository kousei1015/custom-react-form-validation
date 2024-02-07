import React, { useRef, useState } from "react";

// バリデーションルールの型定義
type Rules = {
  minLength?: { value: number; message: string };
};

// エラーオブジェクトの型定義
type Errors<T> = Record<keyof T, { message: string }>;

const useFormDumy = <T extends Record<string, unknown>>() => {

  // エラーオブジェクトを保持する useRef
  const errorsRef = useRef({} as Errors<T>);

  // エラー状態を保持する useState
  const [errors, setErrors] = useState({} as Errors<T>);

  // フィールドを登録する register 関数
  const register = (name: keyof T, rules: Rules) => {

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

        if(JSON.stringify(errors) !== JSON.stringify(errorsRef.current)) {
          setErrors({...errorsRef.current})
        }
      },
    };
  };

  return { register, errors };
};

export default useFormDumy;
