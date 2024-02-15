import React, {useState} from 'react';
import {
  TextInput,
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
  Image,
  ToastAndroid,
  useColorScheme,
} from 'react-native';
import {forgetPassword, login} from '../Services/CommonService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenType} from './StackNavigation';
import OTPTextView from 'react-native-otp-textinput';
// import OTPInput from 'react-native-otp-withpaste';

type Proptype = NativeStackScreenProps<ScreenType, 'ForgetPassword'>;

function ForgetPassword(prop: Proptype) {
  const {navigation} = prop;
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isDarkMode=useColorScheme()==="dark"
  const onPressClear = () => {
    setUserName('');
    setPassword('');
  };
  const [isValid, setIsValidEmail] = useState<boolean>(true);
  function validateEmail(input: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(input);
    setIsValidEmail(isValidEmail);
  }
  const onChangeUsername = (e: any) => {
    setUserName(e);
    validateEmail(e);
    setIsUserNameEmpty(false);
  };
  const oncancelhandle = () => {
    navigation.navigate('WelcomePage');
  };
  const onhandleSubmit = () => {
    setLoading(true);
    var loginDetails = {
      userName: userName,
    };
    if (userName != undefined && userName != '') {
      forgetPassword(userName)
        .then(result => {
          if (result.data.status === 'Failed') {
            setLoading(false);
            ToastAndroid.show(result.data.message, ToastAndroid.SHORT);
           // Toast.show(result.message, Toast.SHORT);
            Alert.alert(result.data.message);
          } else if (result.data.status === 'Success') {
            AsyncStorage.setItem(
              'UserDetails',
              JSON.stringify(result.data.data),
            );
            setLoading(false);
            navigation.navigate('OTPPage');
          }
        })
        .catch((error: any) => {
          setLoading(false);
          console.log('Error occurred', error);
        });
    } else {
      setLoading(false);
      setIsUserNameEmpty(true);
      notifyMessage('Please Provide Valid Username .....');
    }
   // navigation.navigate('OTPPage');
  };
  const onHadleback = () => {
    navigation.navigate('LoginPage');
  };
  const [isUserNameEmpty, setIsUserNameEmpty] = useState(false);

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
  const [pasted, setpasted] = useState(null);
  return (
    <>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <View style={style.container}>
          <Image
            source={require('../assets/lock.png')}
            style={{width: 50, height: 50}}
          />
          <Text style={style.textTitle}>Forget Password</Text>
          <Text style={style.inputTitle}>UserName</Text>
          <TextInput
            placeholder="Enter the Username"
            style={[
              style.textInput,
              {borderColor: isUserNameEmpty ? 'red' : 'black',
              color: isDarkMode ? 'black'  : 'black'},
            ]}
            value={userName}
            placeholderTextColor={isDarkMode ? 'black'  : 'black'}
            onChangeText={onChangeUsername}
            maxLength={50}></TextInput>
          {!isValid && (
            <View style={style.errorMessage}>
              <Text style={style.errorText}>Please Enter Proper Email</Text>
            </View>
          )}
          <View style={style.styleView}>
            <TouchableOpacity
              style={[style.buttonLogin, style.customButton]}
              onPress={onhandleSubmit}>
              <Text style={style.buttonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[style.button, style.signup]}
              onPress={onHadleback}>
              <Text style={style.buttonText}>Back to login</Text>
            </TouchableOpacity>
          </View>

          {/* <OTPInput
            title="Enter OTP"
            type="outline"
            onChange={(code: any) => {
              console.log(code);
            }}
            onPasted={pasted}
          /> */}
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
    backgroundColor: '#05f040',
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
    backgroundColor: '#6252f2',
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
    fontSize: 15,
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
export default ForgetPassword;
