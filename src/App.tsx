import useFormDumy from "./hooks/useFormDummy";

const App = () => {
  const { register, errors } = useFormDumy();

  console.log("Componentがレンダリングされました");
  
  return (
    <>
      <input
        type="text"
        {...register("firstName", {
          minLength: { value: 3, message: "3文字以上入力してください" },
        })}
      />
      {errors?.firstName && <p>{errors.firstName.message}</p>}

      <input
        type="text"
        {...register("lastName", {
          minLength: { value: 3, message: "3文字以上入力してください" },
        })}
      />
      {errors?.lastName && <p>{errors.lastName.message}</p>}
    </>
  );
};

export default App;
