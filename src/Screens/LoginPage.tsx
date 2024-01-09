import axios from 'axios';
import React, {useState} from 'react';
// import Toast from 'react-native-toast';
import {
  TextInput,
  View,
  Text,
  Dimensions,
  StyleSheet,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  Image,
  Platform,
  Alert,
} from 'react-native';
// import { MaterialCommunityIcons } from "@expo/vector-icons/";
import {login} from '../Services/CommonService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenType} from './StackNavigation';

type Proptype = NativeStackScreenProps<ScreenType, 'LoginPage'>;

function LoginPage(prop: Proptype) {
  const {navigation} = prop;
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const onPressClear = () => {
    setUserName('');
    setPassword('');
  };

  const onChangeUsername = (e: any) => {
    setUserName(e);
    setIsUserNameEmpty(false);
  };
  const onChangePassword = (e: any) => {
    setPassword(e);
    setIsPasswordEmpty(false);
  };
  const oncancelhandle = () => {
    navigation.navigate('WelcomePage');
  };
  const loginfuntion = () => {
    setLoading(true);
    var loginDetails = {
      userName: userName,
      password: password,
    };
    if (
      userName != undefined &&
      userName != '' &&
      password != undefined &&
      password != ''
    ) {
      login(loginDetails)
        .then(result => {
          if (result.data.status === 'Failed') {
            setLoading(false);
            //Toast.show(result.data.message, Toast.SHORT);
            Alert.alert(result.data.message);
          } else if (result.data.status === 'Success') {
            AsyncStorage.setItem(
              'LoginResponse',

              result.data.data.token,
            );
            setUserName('');
            setPassword('');
            setLoading(false);
            navigation.navigate('FlatListPage');
          }
        })
        .catch((error: any) => {
          setLoading(false);
          console.log('Error occurred', error);
          // Handle the error here (e.g., show error message, perform error-related actions)
        });
    } else {
      setLoading(false);
      setIsUserNameEmpty(true);
      setIsPasswordEmpty(true);
      notifyMessage('Please Provide Valid Login Details .....');
      // alert("Please Provide Valid Password .....");
      // alert("Please Provide Valid UserName ....");
    }
  };
  const onHadleSignup = () => {
    navigation.navigate('RegistrationPage');
  };
  //const isPasswordEmpty = password.trim() === "";
  const [validationMessage, setValidationMessage] = useState('');
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [isUserNameEmpty, setIsUserNameEmpty] = useState(false);
  const validatePassword = (password: any) => {
    // Password policies
    const minLength = 8;
    const maxLength = 20;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    // Check against policies
    if (password.length < minLength || password.length > maxLength) {
      setValidationMessage('Password must be between 8 and 20 characters');
    } else if (!hasUppercase || !hasLowercase) {
      setValidationMessage(
        'Password must contain both uppercase and lowercase letters',
      );
    } else if (!hasNumber) {
      setValidationMessage('Password must contain at least one number');
    } else if (!hasSpecialChar) {
      setValidationMessage(
        'Password must contain at least one special character',
      );
    } else {
      setValidationMessage('Password is valid');
    }
  };
  function LoadingAnimation() {
    return (
      <View style={style.indicatorWrapper}>
        <ActivityIndicator size="large" color={'#999999'} />
        <Text style={style.indicatorText}>Loading </Text>
      </View>
    );
  }
  function notifyMessage(msg: string) {
    if (Platform.OS === 'android') {
      Alert.alert(msg);
      //ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  }
  return (
    <>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <View style={style.container}>
          {/* <Image
            source={require('../assets/profilepic.png')}
            style={{width: 50, height: 50}}
          /> */}
          <Text style={style.textTitle}>Welcome</Text>
          <Text style={style.inputTitle}>UserName</Text>
          <TextInput
            placeholder="Enter the Username"
            style={[
              style.textInput,
              {borderColor: isUserNameEmpty ? 'red' : 'black'},
            ]}
            value={userName}
            onChangeText={onChangeUsername}
            maxLength={30}></TextInput>
          <Text style={style.inputTitle}>Password</Text>
          <View>
            <TextInput
              placeholder="Enter the Password"
              style={[
                style.textInput,
                {borderColor: isPasswordEmpty ? 'red' : 'black'},
              ]}
              value={password}
              maxLength={30}
              secureTextEntry={isPasswordSecure}
              onChangeText={onChangePassword}
              onKeyPress={validatePassword}

              // right={
              //   <TextInput.Icon
              //     name={() => <MaterialCommunityIcons name={isPasswordSecure ? "eye-off" : "eye"} size={28} color="black" />} // where <Icon /> is any component from vector-icons or anything else
              //     onPress={() => { isPasswordSecure ? setIsPasswordSecure(false) : setIsPasswordSecure(true) }}
              //   />
              // }
            ></TextInput>
            {/* <MaterialCommunityIcons
              name={isPasswordSecure ? "eye-off" : "eye"}
              size={24}
              color="black"
              style={{ position: "absolute", top: 8, right: 10 }}
              onPress={() =>
                isPasswordSecure
                  ? setIsPasswordSecure(false)
                  : setIsPasswordSecure(true)
              }
            /> */}
          </View>

          <View style={style.styleView}>
            <TouchableOpacity
              style={[style.buttonLogin, style.customButton]}
              onPress={loginfuntion}>
              <Text style={{color: '#fff'}}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[style.button, style.signup]}
              onPress={onHadleSignup}>
              <Text style={style.buttonText}>SignUp for free</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}
const width = Dimensions.get('window').width - 70;
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "aqua",
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#080707',
    width,
    height: 40,
    borderRadius: 25,
    paddingLeft: 15,
    marginBottom: 20,
  },
  inputTitle: {
    alignSelf: 'flex-start',
    paddingLeft: 25,
    marginBottom: 5,
    opacity: 0.5,
    color: '#080707',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  styleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonCancel: {
    backgroundColor: '#147EFB',
    textAlign: 'center',
  },
  customButton: {
    padding: 15,
    borderRadius: 5,
    marginLeft: 1,
    marginRight: 8,
    borderColor: '#0e5ced',
  },
  buttonLogin: {
    backgroundColor: '#077a0b',
    textAlign: 'center',
    width: '40%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonClear: {
    backgroundColor: '#131413',
    textAlign: 'center',
  },
  textTitle: {
    color: '#3246a8',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    fontSize: 20,
    textAlign: 'center',
  },
  signup: {
    backgroundColor: '#4267B2',
  },
  button: {
    width: '40%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorMessage: {
    marginTop: 10,
  },
  errorText: {
    color: '#d60909',
  },
  indicatorWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorText: {
    fontSize: 18,
    marginTop: 12,
  },
});
export default LoginPage;
