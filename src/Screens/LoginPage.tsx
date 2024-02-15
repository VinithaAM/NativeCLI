import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
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
  Linking,
  Pressable,
  Clipboard,
  ScrollView,
  useColorScheme,
} from 'react-native';
// import { MaterialCommunityIcons } from "@expo/vector-icons/";
 import {login} from '../Services/CommonService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenType} from './StackNavigation';
// import {AntDesign} from '@expo/vector-icons';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import {useFocusEffect} from '@react-navigation/native';
import JailMonkey from 'jail-monkey';
// import { EyeInvisibleOutlined } from '@ant-design/icons';
// import { EyeInvisibleOutlined } from '@ant-design/icons-react-native';
//import {connectToDatabase, login} from '../Services/Database';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';

type Proptype = NativeStackScreenProps<ScreenType, 'LoginPage'>;

function LoginPage(prop: Proptype) {
  const {navigation} = prop;
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    TokenFetch();
    IsCheckJailBreak()
  }, [Token]);
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

  const TokenFetch = async () => {
    var token = await AsyncStorage.getItem('Token');
    setToken(token);
  };
  useFocusEffect(
    useCallback(() => {
      TokenFetch();
    }, [Token]),
  );
  const loginfuntion = async () => {
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
      // const db = await connectToDatabase();
      // login(db, loginDetails).then(result => {
      //   console.log(result);
      //   if (result.length > 0) {
      //     navigation.navigate('FlatListPage');
      //     setUserName('');
      //     setPassword('');
      //   } else {
      //     notifyMessage('User account Not Found');
      //   }
      //   //console.log(result.length>0),
      // });
      // setLoading(false);
      login(loginDetails)
        .then(result => {
          if (result.data.status === 'Failed') {
            setLoading(false);
            //Toast.show(result.data.message, Toast.SHORT);
            Alert.alert(result.data.message);
          } else if (result.data.status === 'Success') {
            AsyncStorage.setItem(
              'LoginResponse',

              JSON.stringify(result.data.data),
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
    //navigation.navigate('FlatListPage');
  };
  const onHadleSignup = () => {
    navigation.navigate('RegistrationPage');
  };
  const onHandleForgetPassword = () => {
    navigation.navigate('ForgetPassword');
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
  const [isDebuggedMode, setIsDebuggedMode] = useState<boolean>();
  const [isJailBreak, setJailBreak] = useState(false);
  const [canMockLocation, setCanMockLocation] = useState(false);
  const [trustFall, settrustFall] = useState(false);
  const [hookDetected, sethookDetected] = useState(false);
  const [isOnExternalStorage, setisOnExternalStorage] = useState(false);
  const [AdbEnabled, setAdbEnabled] = useState(false);
  const [ispageLoad, setpageLoad] = useState(false);
  const [isDevelopmentSettingsMode, setIsDevelopmentSettingsMode] =
  useState<boolean>(false);
  const IsCheckJailBreak = () => {
    setJailBreak(JailMonkey.isJailBroken());
    setCanMockLocation(JailMonkey.canMockLocation());
    setAdbEnabled(JailMonkey.AdbEnabled());
    sethookDetected(JailMonkey.hookDetected());
    setisOnExternalStorage(JailMonkey.isOnExternalStorage());
    settrustFall(JailMonkey.trustFall());
    JailMonkey.isDevelopmentSettingsMode()
      .then(value => {
        setIsDevelopmentSettingsMode(value);
      })
      .catch(console.warn);
    JailMonkey.isDebuggedMode()
      .then(value => {
        setIsDebuggedMode(value);
      })
      .catch(console.warn);
      InitialLoad()
  };
  const InitialLoad = () => {
    if (isJailBreak) {
      setpageLoad(true);
    } else {
      navigation.navigate('LoginPage');
    }
  };
  function LoadingAnimation() {
    return (
      <View style={style.indicatorWrapper}>
        <ActivityIndicator size="large" color={'#999999'} />
        <Text style={[style.indicatorText,{color:isDarkMode?'black':'black'}]}>Loading ...</Text>
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
  const [openMessage, setOpenMessage] = useState<Boolean>(false);
  const [Token, setToken] = useState('');
  const hideEditModal = () => {
    setOpenMessage(false);
  };
  const handleCopyPress = async () => {
    try {
      await Clipboard.setString(Token);
      console.log('Text copied to clipboard:', Token);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };
  return (
    <>
     {ispageLoad? (
          <View style={style.container}>
            <Text> Your App is Hacked Someone</Text>
          </View>
        ):(
          <View style={style.container}>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <View style={style.container}>
          <Image
            source={require('../assets/profilepic.png')}
            style={{width: 50, height: 50}}
          />
            {/* <Icon name="rss" size={30} color="#900" /> */}
         {/* <EyeInvisibleOutlined style={{ fontSize: 24, color: 'black' }} /> */}
          <Text style={[style.textTitle,{ color: isDarkMode ? '#3246a8'  : '#3246a8'}]}>Welcome</Text>
          <Text style={style.inputTitle}>UserName</Text>
          <TextInput
          
            placeholder="Enter the Username"
            style={[
              style.textInput,
              {borderColor: isUserNameEmpty ? 'red' : 'black',
              color: isDarkMode ? 'black'  : 'black',
              
            },
            ]}
            placeholderTextColor={isDarkMode ? 'black'  : 'black'}
            value={userName}
            onChangeText={onChangeUsername}
            maxLength={50}></TextInput>
          <Text style={style.inputTitle}>Password</Text>
          <View>
            <TextInput
              placeholder="Enter the Password"
              style={[
                style.textInput,
                {borderColor: isPasswordEmpty ? 'red' : 'black',
                color: isDarkMode ? 'black'  : 'black'},
              ]}
              placeholderTextColor={isDarkMode ? 'black'  : 'black'}
              value={password}
              maxLength={30}
              secureTextEntry={isPasswordSecure}
              onChangeText={onChangePassword}
              onKeyPress={validatePassword}

              //</View>right={

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

          <Text
            style={{color: '#103a9e', fontSize: 18}}
            onPress={onHandleForgetPassword}>
            Forget Password?
          </Text>
          {/* Linking.openURL('http://google.com') */}
        </View>
      )}
      <View>
        {/* <TouchableOpacity
          style={[style.message]}
          onPress={() => setOpenMessage(true)}>
          <Text style={style.buttonText}>Token</Text>
        </TouchableOpacity> */}
      </View>
     
      {openMessage && (
        <View>
          <Modal
            animationIn="slideInLeft"
            isVisible={openMessage}
            onBackdropPress={hideEditModal}>
            <View style={style.modalView}>
              <Text style={{margin: 10}}>{Token}</Text>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={[style.customButton, style.copyButton]}
                  onPress={handleCopyPress}>
                  <Text style={{color: '#fff'}}>Copy</Text>
                </Pressable>

                <Pressable
                  style={[style.buttonClear, style.customButton]}
                  onPress={hideEditModal}>
                  <Text style={{color: '#fff'}}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      )}
      </View>
       )}
    </>
  );
}
const width = Dimensions.get('window').width - 70;

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  modalView: {
    flexGrow: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
  copyButton: {
    backgroundColor: '#a86d32',
    textAlign: 'center',
  },
  buttonClear: {
    backgroundColor: '#131413',
    textAlign: 'center',
  },
  textTitle: {
    // color: isDarkMode?'#3246a8':'#3246a8',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    fontSize: 20,
    textAlign: 'center',
  },
  signup: {
    backgroundColor: '#4267B2',
  },
  message: {
    backgroundColor: '#adaba8',
    alignSelf: 'flex-end',
    padding: 20,
    margin: 20,
  },
  button: {
    width: '40%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
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
