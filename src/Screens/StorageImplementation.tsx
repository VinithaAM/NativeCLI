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
} from 'react-native';
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
import Sample from './Sample';

SQLite.enablePromise(true);

function StorageImplementation() {
  // const db = SQLite.openDatabase(
  //   {
  //     name: 'ApplicationDB',
  //     location: 'default',
  //   },

  //   () => {
  //     console.log('db created');
  //   },
  //   error => {
  //     console.log(error);
  //   },
  // );
  const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(false);
  const [firstName, setfirstName] = useState('');
  const [isUserNameEmpty, setIsUserNameEmpty] = useState(false);
  const [email, setEmail] = useState('');
  const [isValid, setIsValidEmail] = useState<boolean>(true);
  const [profilePicture, setProfilePicture] = useState<Uint8Array | null>(null);
  const [userDetails, setUserDetails] = useState([]);
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
  const requestPermission = async () => {
    const grand = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    console.log('granted', grand);
    if (grand == 'granted') {
      await setImages(true);
      await ImagePicker();
    } else {
      await ImagePicker();
    }
  };
  const [selectedImage, setselectedImage] = useState('');
  const [Isvalid, setIsValid] = useState(false);
  const ImagePicker = async () => {
    let Options = {
      path: 'image',
      multiple: true,
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };
    // console.log(images);
    if (images === true) {
      launchCamera(Options, response => {
        console.log(response);
        if (response.didCancel) {
          console.warn('User cancelled image picker');
        } else if (response.assets) {
          setselectedImage(response?.assets[0]?.uri);
          convertToByteArray(selectedImage);
        }
      });
    } else {
      launchImageLibrary(Options, response => {
        //console.log(response);
        if (response.didCancel) {
          console.warn('User cancelled image picker');
        } else if (response.assets) {
          setselectedImage(response?.assets[0]?.uri);
          // console.log(selectedImage);
          convertToByteArray(response?.assets[0]?.uri);
        }
      });
    }
  };
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
    console.log(firstName, email, profilePicture);
    if (firstName != '' && email != '') {
      try {
        addDetails(db, params).then(result => console.log(result));
        getUserdetails();
        handleClear();
        setIsValid(true);
      } catch {
        (error: any) => console.log(error);
      }
    } else {
      console.warn('Please Fill all the field');
      Alert.alert('Please Fill all the field');
    }
  };
  const loadData = useCallback(async () => {
    try {
      const db = await connectToDatabase();
      await createTables(db);
      await getUserdetails();
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  useFocusEffect(
    useCallback(() => {
      getUserdetails();
    }, []),
  );
  const convertToByteArray = async (image: string) => {
    console.log(image);
    if (image) {
      const imagePath = `${image}`;
      const imageBase64 = await RNFS.readFile(imagePath, 'base64');
      if (imageBase64) {
        const byteArray = base64ToByteArray(imageBase64);

        setProfilePicture(byteArray);
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
    console.log('byte', byteArray);
    const charArray = Array.from(byteArray, (byte: any) =>
      String.fromCharCode(byte),
    );

    const base64String = encode(charArray.join(''));

    return base64String;
  }
  const [convertedDetails, setConvertedDetails] = useState([]);
  const [imagePath, setImagePath] = useState('');
  const getUserdetails = async () => {
    const db = await connectToDatabase();
    try {
      getDetails(db).then((result: any) => {
        setUserDetails(result), setConvertedDetails(result);
      });
      var filter = userDetails.filter(x => x.id == 2)[0];
      const bytearray = JSON.stringify(filter.Profilepic);
      //console.log(bytearray);
      const charArray = Array.from(bytearray, (byte: any) =>
        String.fromCharCode(byte),
      );
      const base64String = encode(charArray.join(''));
      console.log('data', base64String);
      setImagePath(`${RNFS.TemporaryDirectoryPath}/image.jpg`);
      RNFS.writeFile(imagePath, base64String, 'base64').then(() =>
        console.log('Image saved ' + imagePath),
      );

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
    } catch {
      (error: any) => console.log(error);
    }
  };

  return (
    <View style={style.container}>
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
      <View style={{flexDirection: 'row'}}>
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
      </View>
      {isValid && userDetails.length > 0 && (
        <View style={{flex: 0.75}}>
          {userDetails.map((x, index) => (
            <>
              <Text style={{fontSize: 15}} key={index}>
                {x.Name} - {x.UserName}
              </Text>
              {imagePath !== '' && (
                <Image
                  style={{height: 50, width: 100, marginBottom: 10}}
                  source={{uri: imagePath}}></Image>
              )}
            </>
          ))}
        </View>
      )}
    </View>
  );
}

export default StorageImplementation;
const width = Dimensions.get('window').width - 70;
const style = StyleSheet.create({
  container: {
    flexGrow: 1.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonClear: {
    backgroundColor: '#131413',
    textAlign: 'center',
  },
});
