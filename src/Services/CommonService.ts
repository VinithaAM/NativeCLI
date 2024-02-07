import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosRequestConfig} from 'axios';

//apiSerive for login

const url = 'https://testsampleenergyapi.azurewebsites.net/api';
//const token = await AsyncStorage.getItem("LoginResponse");
const headers = {
  'Content-Type': 'application/json',
  //Authorization: `Bearer ${token}`,
  // Accept: "application/json",
};
const requestConfig: AxiosRequestConfig = {
  headers: headers,
};

const fetchUser = async () => {
  const configurationObject = {
    method: 'get',
    url: 'https://jsonplaceholder.typicode.com/comments?postId=1',
  };
  const response = await axios(configurationObject);
};

export const login = async (loginDetails: any) => {
  try {
    const result = await axios.post(
      url + `/Login`,
      loginDetails,
      requestConfig,
    );
    return result;
  } catch (error: any) {
    return error.response.data;
  }
};
export const getWeather = () => {
  return axios.get('https://localhost:44354/weatherforecast');
};

// apiService for Singup
export const register = async (loginDetails: any) => {
  try {
    const result = await axios.post(
      url + `/Login/Create`,
      loginDetails,
      requestConfig,
    );
    return result;
  } catch (error: any) {
    return error.response.data;
  }
};

// apiService for HistoryData
export const getHistoryCorrection = async () => {
  const token = await AsyncStorage.getItem('LoginResponse');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    // Accept: "application/json",
  };
  const requestConfig: AxiosRequestConfig = {
    headers: headers,
  };
  //console.log("requestConfig", requestConfig, url);
  try {
    const result = await axios.get(url + '/HistoryData/Get', requestConfig);
    return result;
  } catch (error: any) {
    return error.response;
  }
};
export const MasterHistoryData = async () => {
  const token = await AsyncStorage.getItem('LoginResponse');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    // Accept: "application/json",
  };
  const requestConfig: AxiosRequestConfig = {
    headers: headers,
  };

  try {
    const result = await axios.get(
      url + '/MasterHistoryData/Get',
      requestConfig,
    );
    //.log("result", result);
    return result;
  } catch (error: any) {
    console.log('err', error);
    return error.response;
  }
};
// API Call for New item add
export const AddNewItem = async (ItemDetails: any) => {
  const token = await AsyncStorage.getItem('LoginResponse');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    // Accept: "application/json",
  };
  const requestConfig: AxiosRequestConfig = {
    headers: headers,
  };
  try {
    const result = await axios.post(
      url + `/HistoryData/Create`,
      ItemDetails,
      requestConfig,
    );
    return result;
  } catch (error: any) {
    return error.response.data;
  }
};
export const updateCorrectionDetails = async (updateDetails: any) => {
  const token = await AsyncStorage.getItem('LoginResponse');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    // Accept: "application/json",
  };
  const requestConfig: AxiosRequestConfig = {
    headers: headers,
  };
  try {
    const result = await axios.put(
      url + `/HistoryData/Update`,
      updateDetails,
      requestConfig,
    );
    return result;
  } catch (error: any) {
    return error.response.data;
  }
};
export const deleteCorrection = async (id: any) => {
  const token = await AsyncStorage.getItem('LoginResponse');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    // Accept: "application/json",
  };
  const requestConfig: AxiosRequestConfig = {
    headers: headers,
  };
  try {
    const result = await axios.delete(
      url + `/HistoryData/Delete?id=${id}`,
      requestConfig,
    );
    return result;
  } catch (error: any) {
    return error.response.data;
  }
};
export const forgetPassword = async (email: any) => {
  const token = await AsyncStorage.getItem('LoginResponse');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    // Accept: "application/json",
  };
  const requestConfig: AxiosRequestConfig = {
    headers: headers,
  };
  try {
    console.log("email",email)
    const result = await axios.get(
      url + `/Login/ForgetPassword?Mail=${email}`,
      requestConfig,
    );
    return result;
  } catch (error: any) {
    return error.response.data;
  }
};
export const validateOTP = async (otp: any) => {
  const token = await AsyncStorage.getItem('LoginResponse');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    // Accept: "application/json",
  };
  const requestConfig: AxiosRequestConfig = {
    headers: headers,
  };
  try {
    console.log("email",otp)
    const result = await axios.get(
      url + `/Login/ValidateOTP?Id=${otp.Id}&otp=${otp.OTP}`,
      requestConfig,
    );
    return result;
  } catch (error: any) {
    return error.response.data;
  }
};
export const changePassword = async (obj: any) => {
  const token = await AsyncStorage.getItem('LoginResponse');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    // Accept: "application/json",
  };
  const requestConfig: AxiosRequestConfig = {
    headers: headers,
  };
  try {
    console.log("email",obj)
    const result = await axios.get(
      url + `/Login/ChangePassword?Id=${obj.Id}&password=${obj.password}&userName=${obj.userName}`,
      requestConfig,
    );
    return result;
  } catch (error: any) {
    return error.response.data;
  }
};
