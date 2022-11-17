import { useForm } from "react-hook-form";
import axios from "axios";
import { instance } from "../../recoil/instance";
import styled from "styled-components";
import { FlexCol } from "../../elements/elements";

interface IForm {
  memberEmail: string;
  password: string;
  password1: string;
}

export const ACCESS_TOKEN = sessionStorage.getItem("accesstoken");
export const REFRESH_TOKEN = sessionStorage.getItem("refreshtoken");
console.log(ACCESS_TOKEN);
console.log(ACCESS_TOKEN);

// interface IToken {
//   Authorization: string;
//   refresh: string;
// }

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IForm>({});

  const onValid = async (submitData: IForm) => {
    console.log(submitData);
    if (submitData.password !== submitData.password1) {
      setError(
        "password1",
        { message: "비밀번호가 일치하지 않습니다." },
        { shouldFocus: true }
      );
    } else {
      try {
        const req = {
          memberEmail: submitData.memberEmail,
          password: submitData.password,
        };
        console.log(req);
        const { data } = await instance.post(`/members/login`, req);
        console.log(data.data.accessToken);
        console.log(data.data.refreshToken);
        sessionStorage.setItem("accesstoken", data.data.accessToken);
        sessionStorage.setItem("refreshtoken", data.data.refreshToken);
        return data;
      } catch (error: any) {
        console.log(error.message);
        return error.message;
      }
    }
  };
  const onTrans = async () => {
    try {
      // const req = {
      //   memberEmail: submitData.memberEmail,
      //   password: submitData.password,
      // };

      // const { data } = await instance.get(`/members/me`);

      const preRefreshToken = sessionStorage.getItem("refreshtoken");
      const preAccessToken = sessionStorage.getItem("accesstoken");
      const { data } = await axios.get(`https://dgbnb.shop/members/me`, {
        headers: {
          Authorization: preAccessToken,
          // refresh: preRefreshToken,
        },
      });
      console.log(data);

      // 통신상태: 200, 401, 403, 500, ...
      // ex
      // 1) 액세스토큰이 만료 되었을 때.(에러. 400번대로 예상)
      // 2) 액세스토큰이 만료되지 않았을 때. (에러 200, 300)
      // 3) 통신이 되지 않았을 때.(400)
      // 4) 서버가 닫혔을 때.
      // 5) 유효하지 않은 액세스토큰일때.
      // ...
      // /members/me
      // sessionStorage.setItem("accesstoken", data.data.accessToken);
      // sessionStorage.setItem("refreshtoken", data.data.refreshToken);
      return data;
    } catch (error: any) {
      console.log(error.message);
      return error.message;
    }
  };
  console.log(errors);
  return (
    <>
      <h1>로그인 페이지</h1>
      <form onSubmit={handleSubmit(onValid)}>
        <FlexCol gap="10px">
          <InputBox>
            <Input
              {...register("memberEmail", {
                required: "이메일을 입력해주세요.",
                pattern: {
                  value: /^[a-z0-9+-\_.]{4,15}@[a-z]{4,15}\.[a-z]{2,3}$/,
                  message: "이메일 형식을 확인해주세요.",
                },
              })}
              placeholder="이메일"
            />
            <ErrorMsg>{errors?.memberEmail?.message}</ErrorMsg>
          </InputBox>
          <InputBox>
            <Input
              type="password"
              {...register("password", {
                required: "비밀번호를 입력해주세요.",
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,16}$/,
                  message:
                    "8~16자 영문 대소문자, 숫자, 특수문자 한 자 이상 조합",
                },
              })}
              placeholder="비밀번호"
            />
            <ErrorMsg>{errors?.password?.message}</ErrorMsg>
          </InputBox>
          <InputBox>
            <Input
              type="password"
              {...register("password1", {
                required: "비밀번호를 확인해주세요.",
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,16}$/,
                  message:
                    "8~16자 영문 대소문자, 숫자, 특수문자 한 자 이상 조합",
                },
              })}
              placeholder="중복확인"
            />
            <ErrorMsg>{errors?.password1?.message}</ErrorMsg>
          </InputBox>
          <button>로그인</button>
          {/* <span>{errors?.extraError?.message}</span> */}
        </FlexCol>
      </form>
      <button onClick={() => onTrans()}>통신버튼</button>
    </>
  );
};

// styled-components 영역
const Input = styled.input`
  padding: 4px 8px;
  border-radius: 5px;
  border: 2px solid ${(props) => props.theme.__grayLight};
  :focus {
    outline: 1px solid ${(props) => props.theme.__grayDark};
  }
`;
const InputBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 50px;
  min-width: 300px;
`;
const ErrorMsg = styled.span`
  position: absolute;
  top: 35px;
  font-size: 12px;
  color: tomato;
`;

export default Login;
