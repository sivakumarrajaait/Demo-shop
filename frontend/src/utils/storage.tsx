interface Storage {
  token: string;
  loginType: string;
  User: string;
  UserName: string
}
export const saveToken = (data:Storage) => {
    localStorage.setItem("token", data?.token);
    localStorage.setItem("loginType", data?.loginType);
    localStorage.setItem("userName", data?.UserName);
    if (data?.User) {
      localStorage.setItem(
        "userId",
        data?.User
      );
    }
  };
  
  export const getUserId = () => {
    return localStorage.getItem("userId");
  }
  
  export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  export const getLoginType = () => {
    return localStorage.getItem("loginType");
  };
  export const getUserName = (): string => {
    return localStorage.getItem("userName") || "";
  };
  export const clearStorage = () => {
    localStorage.clear();
  };
  