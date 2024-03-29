import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {Icon} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { changePassword } from '../Services/CommonService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenType } from './StackNavigation';

type Proptype =NativeStackScreenProps<ScreenType,"ChangePassword">
function ChangePassword(prop:Proptype) {
  const{navigation}=prop
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isPasswordEmpty, setPasswordEmpty] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfPasswordSecure, setIsConfPasswordSecure] = useState(true);

const isDarkMode=useColorScheme()==="dark"


  function handleChangepassword(event: any) {
    setPassword(event);
    validatePassword(password);
    setPasswordEmpty(false);
    setPasswordsMatch(event === confirmPassword);
  }
  function handleChangeconfirmPassword(event: any) {
    setconfirmPassword(event);
    setPasswordsMatch(password === event);
  }
  const validatePassword = (password: any) => {
    // Password policies
    const minLength = 8;
    const maxLength = 20;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    // Check against policies
    if (
      password.length <= minLength ||
      password.length >= maxLength ||
      !hasUppercase ||
      !hasLowercase ||
      !hasNumber ||
      !hasSpecialChar
    ) {
      setValidationMessage(
        'Password must be between 8 and 20 characters and uppercase and lowercase letters and at least one number and at least one special character ',
      );
    }
    //else if (!hasUppercase || !hasLowercase) {
    //   setValidationMessage(
    //     'Password must contain both uppercase and lowercase letters',
    //   );
    // } else if (!hasNumber) {
    //   setValidationMessage('Password must contain at least one number');
    // } else if (!hasSpecialChar) {
    //   setValidationMessage(
    //     'Password must contain at least one special character',
    //   );
    // }
    else {
      setValidationMessage('Password is valid');
    }
  };
  const[id,setId]=useState(0);
  const[userName, setUsername]=useState('')
  useEffect(()=>{
    userDetails()
  },[])
  const userDetails = async ()=>{
    const UserDetails = await AsyncStorage.getItem('UserDetails');
    const userId=JSON.parse(UserDetails).id
    const UserName=JSON.parse(UserDetails).userName
     setId(userId)
     setUsername(UserName)
  }
  const onhandleSave = () => {
    var res={
      Id:id,
      password:password,
      userName:userName
    }
    try{
      if(password !="" && password != undefined && userName !="" && userName !=undefined){
        changePassword(res).then((result:any)=>{
            if(result.data.status=="Failed"){
              ToastAndroid.show(result.data.message,ToastAndroid.LONG)
              Alert.alert(result.data.message)
            }
            else if(result.data.status=="Success"){
              ToastAndroid.show(result.data.message,ToastAndroid.LONG)
              navigation.navigate("LoginPage")
                AsyncStorage.removeItem("UserDetails")
                // clear("UserDetails");
               navigation.navigate('LoginPage');
            }
        }).catch((error:any)=>
        console.log('Error occured', error.message)
        )
      }
     else{
      ToastAndroid.show("Please provide password details....",ToastAndroid.LONG)
      Alert.alert("Please provide password details....")
     }
    }
    catch(error:any){
      console.log('Error occured', error.message);
      navigation.navigate('LoginPage');
    }
    
  };
  const onHandleClear = () => {
    setPassword('');
    setconfirmPassword('');
  };
  return (
    <KeyboardAvoidingView style={style.container}>
      <Text style={style.textTitle}>Change Password</Text>
      <Text style={style.inputTitle}>Password</Text>
      <View style={style.innerContainer}>
        <TextInput
          placeholder="Enter the Password"
          style={[
            style.textInput,
            {borderColor: isPasswordEmpty ? 'red' : 'black',
            color: isDarkMode ? 'black'  : 'black'},
          ]}
          placeholderTextColor={isDarkMode ? 'black'  : 'black'}
          value={password}
          secureTextEntry={isPasswordSecure}
          maxLength={20}
          onChangeText={handleChangepassword}
          onKeyPress={validatePassword}></TextInput>
        {/* <Icon
          name={isPasswordSecure ? 'facebook' : 'eye'}
          size={20}
          color="black"
          style={{position: 'absolute', top: 8, right: 10}}
          onPress={() =>
            isPasswordSecure
              ? setIsPasswordSecure(false)
              : setIsPasswordSecure(true)
          }
        /> */}
        <View style={{alignSelf:"center"}}>
        {validationMessage !== '' &&
          validationMessage !== 'Password is valid' && (
            <View style={style.errorMessage}>
              <Text style={style.errorText}>{validationMessage}</Text>
            </View>
          )}
     </View>

      <Text style={style.inputTitle}>Confirm Password</Text>
  
        <TextInput
          placeholder="Enter the confirmPassword"
          style={[style.textInput,{color: isDarkMode ? 'black'  : 'black'}]}
          value={confirmPassword}
          secureTextEntry={isConfPasswordSecure}
          maxLength={30}
          placeholderTextColor={isDarkMode ? 'black'  : 'black'}
          onChangeText={handleChangeconfirmPassword}></TextInput>
        {/* <Icon
          name={isConfPasswordSecure ? 'eye-off' : 'eye'}
          size={24}
          color="black"
          style={{position: 'absolute', top: 8, right: 10}}
          onPress={() =>
            isConfPasswordSecure
              ? setIsConfPasswordSecure(false)
              : setIsConfPasswordSecure(true)
          }
        /> */}
        {!passwordsMatch && (
          <View style={style.errorMessage}>
            <Text style={style.errorText}>Password Doesn't Match</Text>
          </View>
        )}
      </View>
      <View style={style.styleView}>
        <TouchableOpacity
          style={[style.buttonLogin, style.customButton]}
          onPress={onhandleSave}>
          <Text style={{color: '#fff'}}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[style.customButton, style.buttonClear]}
          onPress={onHandleClear}>
          <Text style={{color: '#fff'}}>Clear</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
const width = Dimensions.get('window').width - 70;
const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width:width+40
  },

  textInput: {
    borderWidth: 2,
    borderColor: 'black',
    width,
    height: 40,
    borderRadius: 25,
    paddingLeft: 15,
    marginBottom: 20,
  },
  innerContainer:{
  justifyContent:"center",
  alignItems:"center"
  },
  inputTitle: {
    alignSelf: 'flex-start',
    paddingLeft: 25,
    marginBottom: 5,
    opacity: 0.5,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'serif',
    fontSize: 15,
    marginRight: 100,
  },
  styleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  customButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 4,
    marginRight: 4,
    borderColor: 'blue',
  },
  buttonLogin: {
    backgroundColor: 'green',
    textAlign: 'center',
  },
  buttonClear: {
    backgroundColor: '#131413',
    textAlign: 'center',
  },
  textTitle: {
    color: 'blue',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    fontSize: 20,
    textAlign: 'center',
  },

  errorMessage: {
    margin: 10,
  },
  errorText: {
    color: 'red',
  },
});
export default ChangePassword;
