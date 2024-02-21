import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
  Alert,
  FlatList,
  Platform,
  useColorScheme,
} from 'react-native';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {enablePromise, openDatabase} from 'react-native-sqlite-storage';
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
import {decode, encode} from 'base-64';
import {
  addDetails,
  connectToDatabase,
  createTables,
  getDetails,
} from '../Services/Database';
import {IUserDetails} from '../Components/HistoryDataCorrectionModel';
import {useFocusEffect} from '@react-navigation/native';
import Sample from './Jail-Monkey';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenType} from './StackNavigation';
import ImagePicker from 'react-native-image-picker';

SQLite.enablePromise(true);
type typeprop = NativeStackScreenProps<ScreenType, 'storage'>;
function StorageImplementation(prop: typeprop) {
  const {navigation} = prop;
  const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(false);
  const [firstName, setfirstName] = useState('');
  const [isUserNameEmpty, setIsUserNameEmpty] = useState(false);
  const [email, setEmail] = useState('');
  const [isValid, setIsValidEmail] = useState<boolean>(true);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState([]);

const isDarkMode=useColorScheme()==="dark"



  function handleChangefirstname(event: any) {
    const value = event;
    const sanitizedValue = value.replace(/[^a-zA-Z]/g, '');
    setfirstName(sanitizedValue);
    setIsFirstNameEmpty(false);
  }
  function handleChangeemail(event: any) {
    setEmail(event);
    validateEmail(email);
    setIsUserNameEmpty(false);
  }
  function validateEmail(input: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(input);
    setIsValidEmail(isValidEmail);
  }
  const [images, setImages] = useState(false);
  const [camerapermission, setcameraPermission] = useState<any>();
  const [mediapermission, setmediapermission] = useState<any>();
  const [showComponent,setShowComponent]=useState(false)
  const selectImage = () => {
    setShowComponent(true)
  };
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const grand = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      setcameraPermission(grand);
      console.log('camerapermission', camerapermission);
    } else if (Platform.OS === 'ios') {
    }
    if (Platform.OS === 'android') {
      const mediapermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      );
      setmediapermission(mediapermission);
    } else if (Platform.OS === 'ios') {
    }
  };
  const [selectedImage, setselectedImage] = useState('');
  const [Isvalid, setIsValid] = useState(false);

  function handleClear() {
    setfirstName('');
    setImages(false);
    setEmail('');
    setselectedImage('');
  }
  const onSaveClick = async () => {
    let params = {
      id: 0,
      Name: firstName,
      UserName: email,
      Profilepic: profilePicture,
    };
    const db = await connectToDatabase();
    console.log(isValid);
    if (
      firstName !== '' &&
      email !== '' &&
      profilePicture !== '' &&
      isValid !== false
    ) {
      try {
        addDetails(db, params).then(result =>{
          if(result[0].rowsAffected=1){
              Alert.alert("Saved Successfully")
              handleClear();
              setIsValid(true);
          }
          else{
            Alert.alert("issue in saving file..")
          }
        } );
      } catch {
        (error: any) => console.log(error);
      }
    } else if (isValid !== true) {
      setIsUserNameEmpty(true);
      Alert.alert('Please enter valid Email');
    } else {
      setIsUserNameEmpty(true);
      setIsFirstNameEmpty(true)
      Alert.alert('Please Fill all the field');
    }
  };
  const loadData = useCallback(async () => {
    try {
      const db = await connectToDatabase();
      await createTables(db);
      // await getUserdetails();
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadData();
    requestPermission()
    checkPermission()
  }, [loadData]);
  useFocusEffect(
    useCallback(() => {
      checkPermission()
      requestPermission()
      // getUserdetails();
    }, []),
  );
  const checkPermission=()=>{
    if(camerapermission==="never_ask_again"){
      requestPermission()
    }
  }
  const onHandleCameraFunction =async ()=>{
    let Options = {
      path: 'image',
      multiple: true,
      includeBase64: true,
      maxHeight: 200,
      maxWidth: 200,
    };
    var grand;
    console.log("cccc",camerapermission)
    if (camerapermission === PermissionsAndroid.RESULTS.GRANTED) {
      await launchCamera(Options, response => {
       // console.log(response);
        if (response.didCancel) {
          console.warn('User cancelled image picker');
        } else if (response.assets) {
          setselectedImage(response?.assets[0]?.uri);onModelHide()
          // setShowComponent(true)
          //convertToByteArray(selectedImage);
          setProfilePicture(response?.assets[0]?.base64);
          onModelHide()
        }
      });
    }
    // else if(camerapermission==="never_ask_again"){
    //   setcameraPermission('')
    //  requestPermission()
    // }
    else{
      Alert.alert("There is no camera permission for this app.....")
    }
  }
  const onModelHide=()=>{
    setShowComponent(false)
  }
  const onHandleMediaFunction=async ()=>{
    let Options = {
      path: 'image',
      multiple: true,
      includeBase64: true,
      maxHeight: 200,
      maxWidth: 200,
    };
    if (mediapermission === PermissionsAndroid.RESULTS.GRANTED) {
    await launchImageLibrary(Options, response => {
      //console.log(response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.assets) {
        setselectedImage(response?.assets[0]?.uri);
        setProfilePicture(Options.includeBase64);
        // console.log(selectedImage);
        convertToByteArray(response?.assets[0]?.uri);
        onModelHide()
      }
    });
  }
  else{
    Alert.alert("There is no Media permission for this app.....")
  }
  }
  const convertToByteArray = async (image: string) => {
    // console.log('imagefor save', image);
    if (image) {
      const imagePath = `${image}`;
      const imageBase64 = await RNFS.readFile(imagePath, 'base64');
      // console.log('base', imageBase64);
      if (imageBase64) {
        const byteArray = base64ToByteArray(imageBase64);
        setProfilePicture(imageBase64);
      }
    }
  };
  function base64ToByteArray(base64String: string) {
    const decodedString = decode(base64String);
    const byteArray = new Uint8Array(decodedString.length);
    for (let i = 0; i < decodedString.length; i++) {
      byteArray[i] = decodedString.charCodeAt(i);
    }
    return byteArray;
  }
  function byteArrayToBase64(byteArray: any) {
    const charArray = Array.from(byteArray, (byte: any) =>
      String.fromCharCode(byte),
    );
    const base64String = encode(charArray.join(''));
    return base64String;
  }
  const [convertedDetails, setConvertedDetails] = useState([]);
  const [imagePath, setImagePath] = useState('');
  const [imageforDisplay, setImageforDisplay] = useState(false);
  const [base64stringImage, setbase64string] = useState<string>('');
  const getUserdetails = async () => {
    navigation.navigate('ViewModel');
    // const db = await connectToDatabase();
    // setImageforDisplay(true);
    // try {
    //   getDetails(db).then((result: any) => {
    //     setUserDetails(result), setConvertedDetails(result);
    //   });
    //   var filter = userDetails.filter(x => x.id == 2)[0];
    //   // const textEncoder = new TextEncoder();
    //   //const byteArray = textEncoder.encode(filter.Profilepic);
    //   const imgByte: number[] = filter.Profilepic.replace('"');
    //   //console.log(imgByte);
    //   const charArray = Array.from(imgByte, (byte: any) =>
    //     String.fromCharCode(byte),
    //   );

    //   const imagesavepath = '../src/assets/image.jpg';
    //   const base64String = encode(charArray.join(''));
    //   setbase64string(filter.Profilepic);
    //   console.log('data', base64stringImage);
    // setImagePath(`file://${RNFS.TemporaryDirectoryPath}/image.jpg`);

    // RNFS.writeFile(imagePath, base64String, 'base64').then(() =>
    //   console.log('Image saved ' + imagePath),
    // );
    // <Modal animationIn="slideInUp" isVisible={imagePath !== ''}>
    //   <View>{imagePath && <Image source={{uri: imagePath}}></Image>}</View>
    // </Modal>;

    // userDetails.forEach(element => {
    //   var base64 = byteArrayToBase64([element.Profilepic]);
    //   //console.log('base', base64);
    //   convertedDetails.forEach(ele => {
    //     if ((ele.id = element.id)) {
    //       ele.Profilepic = base64;
    //     }
    //   });
    // });

    //console.log('user', userDetails);
    // } catch {
    //   (error: any) => console.log(error);
    // }
  };

  return (
    <View style={style.container}>
      <Text style={{fontSize: 25,fontWeight:"900", color: '#3246a8'}}>Profile</Text>
      <Text style={style.inputTitle}>Firstname</Text>
      <TextInput
        placeholder="Enter the Firstame"
        placeholderTextColor={isDarkMode ? 'black'  : 'black'}
        style={[
          style.textInput,
          {borderColor: isFirstNameEmpty ? 'red' : 'black',
          color:isDarkMode?'black':'black'},
        ]}
        value={firstName}
        maxLength={30}
        onChangeText={handleChangefirstname}></TextInput>
      <Text style={style.inputTitle}>Username</Text>
      <TextInput
        placeholder="Enter the Username"
        placeholderTextColor={isDarkMode ? 'black'  : 'black'}
        style={[
          style.textInput,
          {borderColor: isUserNameEmpty ? 'red' : 'black',
          color:isDarkMode?'black':'black'},
        ]}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        maxLength={50}
        onChangeText={handleChangeemail}></TextInput>
      {!isValid && (
        <View style={style.errorMessage}>
          <Text style={style.errorText}>Please Enter Proper Email</Text>
        </View>
      )}
      <View style={{flexDirection: 'row'}}>
        <Text style={style.inputTitle}>Upload Pic</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={[style.uploadbutton]}
            onPress={() => {
              selectImage();
            }}>
            <Text style={{color: '#fff'}}>Select Image</Text>
          </TouchableOpacity>
          {selectedImage !== '' && (
            <Image
              style={{height: 50, width: 100, marginBottom: 10}}
              source={{uri: selectedImage}}></Image>
          )}
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
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
          style={[style.buttonGet, style.customButton]}
          onPress={getUserdetails}>
          <Text style={{color: '#fff'}}> Get</Text>
        </TouchableOpacity>
      </View>
      {showComponent && (
        <Modal animationIn="slideInUp" isVisible={showComponent} onModalHide={onModelHide}> 
        
        <View style={style.modalView}>
        <Text style={{fontWeight:"900",color:"#0e20e6",marginRight:180,fontSize:20,marginBottom:15}}>Add New</Text>
        <TouchableOpacity
          // style={[style.buttonClear, style.customButton]}
          onPress={onHandleCameraFunction}>
        <Text style={{fontWeight:"900",alignSelf:"flex-start",marginRight:180,color:isDarkMode?'black':'black'}}>Take photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          // style={[style.buttonClear, style.customButton]}
          onPress={onHandleMediaFunction}>
        <Text style={{fontWeight:"900",alignSelf:"flex-start",marginRight:180,marginTop:15,color:isDarkMode?'black':'black'}}>Select file</Text>
        </TouchableOpacity>
        <TouchableOpacity
          // style={[style.buttonClear, style.customButton]}
          onPress={onModelHide}>
        <Text style={{fontWeight:"900",alignSelf:"flex-start",marginLeft:180,marginTop:10,color:"#e61c0e"}}>Cancel</Text>
        </TouchableOpacity>
    </View>
    </Modal>
      )}
    </View>
  );
}

export default StorageImplementation;
const width = Dimensions.get('window').width - 90;
const style = StyleSheet.create({
  container: {
    flexGrow: 1.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flexGrow: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
   
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
  textInput: {
    borderWidth: 2,
    borderColor: 'black',
    width,
    height: 40,
    borderRadius: 25,
    paddingLeft: 15,
    marginBottom: 20,
  },
  errorMessage: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
  },
  uploadbutton: {
    padding: 5,
    borderRadius: 5,
    marginBottom: 15,
    marginRight: 30,
    color: '#fff',
    marginLeft: 0,
    backgroundColor: '#039dfc',
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
  buttonGet: {
    backgroundColor: '#4267B2',
    textAlign: 'center',
  },
  buttonClear: {
    backgroundColor: '#131413',
    textAlign: 'center',
  },
});
