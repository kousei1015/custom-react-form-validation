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
