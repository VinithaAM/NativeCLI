import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import {Alert, Dimensions, StyleSheet, Text, ToastAndroid, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import OTPTextView from '@twotalltotems/react-native-otp-input';
import {ScreenType} from './StackNavigation';
import { validateOTP } from '../Services/CommonService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OtpInputs from 'react-native-otp-inputs';

type Proptype = NativeStackScreenProps<ScreenType, 'OTPPage'>;
function OtpScreen(prop: Proptype) {
  const {navigation} = prop;
  const[Otp,setOtp]=useState("");
  const[id,setId]=useState(0);
  useEffect(()=>{
    userDetails()
  },[])
  const userDetails = async ()=>{
    const token = await AsyncStorage.getItem('UserDetails');
    const userId=JSON.parse(token).id
     setId(userId)
  }
  const onHandleresend = () => {};
  const handleOtpChange =(e:any)=>{
      setOtp(e)
  }
  const onhandleSubmit = () => {
    var loginDetails = {
      Id: id,
      OTP:Otp
    };
    if (id != 0 && Otp != '') {
      validateOTP(loginDetails)
        .then(result => {
          if (result.data.status === 'Failed') {
           // setLoading(false);
            ToastAndroid.show(result.data.message, ToastAndroid.SHORT);
           // Toast.show(result.message, Toast.SHORT);
            Alert.alert(result.data.message);
          } else if (result.data.status === 'Success') {
            //setLoading(false);
            navigation.navigate('ChangePassword');
          }
        })
        .catch((error: any) => {
          //setLoading(false);
          console.log('Error occurred', error);
        });
    } else {
      //setLoading(false);
      ToastAndroid.show("Please Provide Valid OTP", ToastAndroid.SHORT);
      // Toast.show(result.message, Toast.SHORT);
       Alert.alert("Please Provide Valid OTP");
    }
   // navigation.navigate('ChangePassword');
  };
  return (
    <View style={style.container}>
      <Text style={style.textTitle}> Please Enter One time Password</Text>
      <View style={{flexDirection:"row"}}></View>
      <OtpInputs
       handleChange={handleOtpChange}
       numberOfInputs={4}
       style={style.input}
       clearTextOnFocus
          // handleChange={(code) => console.log(code)}
          // keyboardType="number-pad"
          // numberOfInputs={1}
          // selectTextOnFocus={true}
          // ref={otpRef}
        />
          {/* <OtpInputs
      style={style.input}
          handleChange={(code) => console.log(code)}
          keyboardType="phone-pad"
          numberOfInputs={1}
          maxLength={1}
        /> */}
     
    
      {/* <OTPTextView
       style={{ width: '50%', height: 50 }}
       pinCount={4}
       autoFocusOnLoad
       keyboardType='number-pad'
       codeInputFieldStyle={{ width: 30, height: 15 }}
       codeInputHighlightStyle={{ borderColor: 'black' }}
       onCodeFilled ={handleOtpChange}
       onCodeChanged={handleOtpChange}
      ></OTPTextView> */}
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={[style.buttonLogin, style.customButton]}
          onPress={onhandleSubmit}>
          <Text style={style.buttonText}>Submit</Text>
        </TouchableOpacity>
        <Text
          style={{
            color: '#103a9e',
            fontSize: 18,
            marginTop: 40,
            marginLeft: 10,
          }}
          onPress={onHandleresend}>
          Resend OTP?
        </Text>
      </View>
    </View>
  );
}
const width = Dimensions.get('window').width - 70;
const style = StyleSheet.create({
  container: {
    flex: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
     borderWidth: 1,
     borderColor: 'gray',
     borderRadius: 5,
     width: 120,
    // height: 40,
    marginHorizontal: 5,
    marginLeft:5,
    textAlign: 'center',
    fontSize: 16,
    flexDirection:"row"
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
    width: '25%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    margin: 30,
  },

  textTitle: {
    color: '#3246a8',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    fontSize: 20,
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
export default OtpScreen;
