import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button,
  Platform,
  Pressable,
  ToastAndroid,
  Alert,
  Image,
  ViewBase,
} from 'react-native';
import {ScreenType} from './StackNavigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import {register} from '../Services/CommonService';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
// import { MaterialCommunityIcons } from "@expo/vector-icons/";
import {PermissionsAndroid, Linking} from 'react-native';

type typeprop = NativeStackScreenProps<ScreenType, 'RegistrationPage'>;
function RegistrationPage(prop: typeprop) {
  const {navigation} = prop;
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDOB] = useState(new Date());
  const [confirmPassword, setconfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isValid, setIsValidEmail] = useState<boolean>(true);
  const [isValidPassword, setIsValidPassword] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfPasswordSecure, setIsConfPasswordSecure] = useState(true);

  function handleChangefirstname(event: any) {
    const value = event;
    const sanitizedValue = value.replace(/[^a-zA-Z]/g, '');
    setfirstName(sanitizedValue);
    setIsFirstNameEmpty(false);
  }
  function handleChangelastname(event: any) {
    const value = event;
    const sanitizedValue = value.replace(/[^a-zA-Z]/g, '');
    setlastName(sanitizedValue);
  }
  function handleChangeemail(event: any) {
    setEmail(event);
    validateEmail(email);
    setIsUserNameEmpty(false);
  }
  function handleChangedob(event: any) {
    setDOB(event.target.value);
  }
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
  function handleClear() {
    setfirstName('');
    setlastName('');
    setDOB(new Date());
    setEmail('');
    setPassword('');
    setconfirmPassword('');
  }
  function validateEmail(input: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(input);
    setIsValidEmail(isValidEmail);
  }

  const changeDate = (e: any) => {
    setDate(e.target.value);
  };
  function fieldValidation() {
    var res: boolean = false;
    if (
      firstName === null ||
      (firstName === '' && email === null) ||
      (email === '' && password === null) ||
      (password === '' && dob === null)
    ) {
      res = true;
      setIsFirstNameEmpty(true);
      setIsUserNameEmpty(true);
      setPasswordEmpty(true);
    } else {
      res = false;
    }
    return res;
  }
  const oncancelhandle = () => {
    navigation.navigate('LoginPage');
  };
  const onSaveClick = () => {
    let params = {
      id: 0,
      firstName: firstName,
      lastName: lastName,
      userName: email,
      password: password,
      dOB: dob ? dob : new Date(),
      status: true,
    };
    console.log(params);
    if (firstName != '' && email != '' && password != '') {
      console.log(params);
      try {
        register(params)
          .then((result: any) => {
            if (result.data != null) {
              // toast.success("Register Successfully...", {
              //   position: "top-right",
              //   autoClose: 3000,
              //   style: {
              //     backgroundColor: "lightgreen",
              //     color: "white",
              //   },
              // });
              navigation.navigate('LoginPage');
            }
          })
          .catch((error: any) => {
            console.log('Error occurred', error.message);
            navigation.navigate('LoginPage');
          });
      } catch (error: any) {
        console.log('Error occured', error.message);
        navigation.navigate('LoginPage');
      }
    } else {
      notifyMessage('Please Fill detail in the form....');
    }
  };

  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  // const onChange = ({ type }, selectedDate:any) => {
  //   if (type== "set") {
  //     const currentdate = selectedDate;
  //     setDate(currentdate);
  //     if (Platform.OS === "android") {
  //       setDOB(currentdate);
  //     }
  //     showDatePicker();
  //   } else {
  //     showDatePicker();
  //   }
  // };
  const onChange = (selectedDate: any) => {
    var newDate = new Date(selectedDate);
    //setShowDatePicker(Platform.OS === 'ios');
    if (newDate) {
      //setDate(selectedDate);
      // var date = formatDate(newDate);
      setDOB(selectedDate);
      setDate(selectedDate);
    }
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    setSelectedDate(date);
    hideDatePicker();
  };
  const [validationMessage, setValidationMessage] = useState('');
  const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(false);
  const [isPasswordEmpty, setPasswordEmpty] = useState(false);
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
  function notifyMessage(msg: string) {
    if (Platform.OS === 'android') {
      Alert.alert(msg);
      //ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  }
  const handleSaveLocalStorage = () => {};
  const handleConfirmDate = (date: any) => {
    var newDate = new Date(date);
    setDOB(newDate);
    hideDatePicker();
  };
  const [selectedImage, setselectedImage] = useState('');
  const ImagePicker = () => {
    let Options = {
      path: 'image',
      multiple: true,
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };
    console.log(images);
    if (images === true) {
      launchCamera(Options, response => {
        console.log(response);
        if (response.didCancel) {
          console.warn('User cancelled image picker');
        } else if (response.assets) {
          setselectedImage(response?.assets[0]?.uri);
        }
      });
    } else {
      launchImageLibrary(Options, response => {
        console.log(response);
        if (response.didCancel) {
          console.warn('User cancelled image picker');
        } else if (response.assets) {
          setselectedImage(response?.assets[0]?.uri);
        }
        console.log('images', selectedImage);
      });
    }

    // if (response.didCancel) {
    //   console.log('User cancelled image picker');
    // } else if (response.error) {
    //   console.log('ImagePicker Error: ', response.error);
    // } else if (response.assets) {
    //   // Handle selected images
    //   const selectedImages = response.assets.map(asset => asset.uri);
    //   setselectedImage(selectedImages);
    // }
    // console.log('images', selectedImage);
    // });
  };
  // const imagepickermulti = () => {
  //   const options = {
  //     multiple: true,
  //   };
  //   ImagePicker.openPicker({
  //     multiple: true,
  //   }).then(images => {
  //     console.log(images);
  //     setselectedImage(images.map(x => x.path));
  //     console.log('sele', selectedImage.length);
  //   });
  // };
  // useEffect(() => {
  //   setTimeout(() => {
  //     requestPermission();
  //   }, 5000);
  // }, []);
  const [images, setImages] = useState(false);
  const requestPermission = async () => {
    const grand = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    console.log('granted', grand);
    if (grand == 'granted') {
      setImages(true);
      await ImagePicker();
    } else {
      await ImagePicker();
    }
  };

  return (
    <View style={style.container}>
      <Text style={style.textTitle}>Sign Up Form</Text>

      <Text style={style.inputTitle}>Firstname</Text>
      <TextInput
        placeholder="Enter the Firstame"
        style={[
          style.textInput,
          {borderColor: isFirstNameEmpty ? 'red' : 'black'},
        ]}
        value={firstName}
        maxLength={30}
        onChangeText={handleChangefirstname}></TextInput>
      <Text style={style.inputTitle}>Lastname</Text>
      <TextInput
        placeholder="Enter the Lastname"
        style={style.textInput}
        value={lastName}
        maxLength={30}
        onChangeText={handleChangelastname}></TextInput>

      <Text style={style.inputTitle}>Username</Text>
      <TextInput
        placeholder="Enter the Username"
        style={[
          style.textInput,
          {borderColor: isUserNameEmpty ? 'red' : 'black'},
        ]}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        maxLength={30}
        onChangeText={handleChangeemail}></TextInput>
      {!isValid && (
        <View style={style.errorMessage}>
          <Text style={style.errorText}>Please Enter Proper Email</Text>
        </View>
      )}
      <Text style={style.inputTitle}>Password</Text>
      <View>
        <TextInput
          placeholder="Enter the Password"
          style={[
            style.textInput,
            {borderColor: isPasswordEmpty ? 'red' : 'black'},
          ]}
          value={password}
          secureTextEntry={isPasswordSecure}
          maxLength={30}
          onChangeText={handleChangepassword}
          onKeyPress={validatePassword}></TextInput>
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
        {validationMessage !== '' &&
          validationMessage !== 'Password is valid' && (
            <View style={style.errorMessage}>
              <Text style={style.errorText}>{validationMessage}</Text>
            </View>
          )}
      </View>

      <Text style={style.inputTitle}>Confirm Password</Text>
      <View>
        <TextInput
          placeholder="Enter the confirmPassword"
          style={style.textInput}
          value={confirmPassword}
          secureTextEntry={isConfPasswordSecure}
          maxLength={30}
          onChangeText={handleChangeconfirmPassword}></TextInput>
        {/* <MaterialCommunityIcons
          name={isConfPasswordSecure ? "eye-off" : "eye"}
          size={24}
          color="black"
          style={{ position: "absolute", top: 8, right: 10 }}
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

      <View style={style.insideContainer}>
        <Text style={style.inputTitle}>DOB</Text>
        <Pressable onPress={showDatePicker}>
          <Text style={style.Datepicker}>Select DOB</Text>
        </Pressable>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          maximumDate={new Date()}
        />
        {/* {isDatePickerVisible && (
          <DateTimePicker
            mode="date"
            display="spinner"
            value={date}
            onChange={onChange}
            //onChange={changeDate}
            maximumDate={new Date()}></DateTimePicker>
        )} */}
        {/* {!isDatePickerVisible && (
          <Pressable onPress={showDatePicker}>
            <TextInput
              style={style.textInput}
              onChangeText={setDOB}
              editable={false}
              value={dob}
              onPressIn={showDatePicker}
            >
              DOB
            </TextInput>
          </Pressable>
        )} */}
      </View>
      {/* <View style={style.insideContainer}>
        <Text style={style.inputTitle}>Upload Pic</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={[style.uploadbutton]}
            onPress={() => {
              requestPermission();
            }}>
            <Text style={{color: '#fff'}}>Select Image</Text>
          </TouchableOpacity>
          {selectedImage !== '' && (
            <Image
              style={{height: 50, width: 100, marginBottom: 10}}
              source={{uri: selectedImage}}></Image>
          )}
        </View>
      </View> */}
      <View>
        {/* {selectedImage.length > 0 && (
          <View style={{flexDirection: 'row', margin: 5}}>
            {selectedImage.map((image, index) => (
              <Image
                key={index}
                style={{height: 50, width: 100, marginBottom: 10}}
                source={{uri: image}}
              />
            ))}
            
          </View>
        )} */}
        {/* <Image
          style={{height: 50, width: 100, marginBottom: 10}}
          source={{uri: selectedImage}}></Image> */}
      </View>
      <View style={style.styleView}>
        <TouchableOpacity
          style={[style.buttonLogin, style.customButton]}
          onPress={onSaveClick}>
          <Text style={{color: '#fff'}}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[style.buttonClear, style.customButton]}
          onPress={handleClear}>
          <Text style={{color: '#fff'}}> Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[style.buttonCancel, style.customButton]}
          onPress={oncancelhandle}>
          <Text style={{color: '#fff'}}> Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const width = Dimensions.get('window').width - 70;
const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadbutton: {
    padding: 5,
    borderRadius: 5,
    marginBottom: 15,
    marginRight: 70,
    color: '#fff',
    marginLeft: 0,
    backgroundColor: '#039dfc',
  },
  insideContainer: {
    flexDirection: 'row',
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
  inputTitle: {
    alignSelf: 'flex-start',
    paddingLeft: 25,
    marginBottom: 5,
    opacity: 0.5,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'serif',
    fontSize: 15,
    marginRight: 50,
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
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    fontSize: 25,
  },
  Datepicker: {
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'blue',
    marginRight: 150,
    color: 'white',
    //marginLeft: 25,
  },
  datetime: {
    height: 120,
    marginTop: -10,
  },
  errorMessage: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
  },
  // height:120,
  // marginTop:-10
});
export default RegistrationPage;

{
  /* <View style={style.styleView}>
        <TouchableOpacity
          style={[style.buttonLogin, style.customButton]}
          onPress={onSaveClick}
        >
          <Text style={{ color: "#fff" }}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[style.buttonCancel, style.customButton]}>
          <Text style={{ color: "#fff" }}> Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[style.buttonClear, style.customButton]}
          onPress={handleClear}
        >
          <Text style={{ color: "#fff" }}> Clear</Text>
        </TouchableOpacity>
      </View> */
}
