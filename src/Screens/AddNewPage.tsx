import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
  Platform,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
// import AntDesign from "@expo/vector-icons/AntDesign";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenType} from './StackNavigation';
// import DateTimePicker from "@react-native-community/datetimepicker";
import {AddNewItem, MasterHistoryData} from '../Services/CommonService';
// import RNDateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {MasterData} from '../Components/dummyData';
import {IMasterName} from '../Components/HistoryDataCorrectionModel';
import {addcorrectionDetails, connectToDatabase} from '../Services/Database';

type typeprop = NativeStackScreenProps<ScreenType, 'AddNew'>;
function AddNewPage(prop: typeprop) {
  const {navigation} = prop;

  const renderItem = (item: any) => {
    return (
      <View style={style.item}>
        <Text style={style.textItem}>{item.historyId}</Text>
        {/* {item.value === value && (
          <AntDesign style={style.icon} color="black" name="Safety" size={20} />
        )} */}
      </View>
    );
  };
  const oncancelhandle = () => {
    navigation.navigate('FlatListPage');
  };
  const [historyId, sethistoryId] = useState('');
  const [timeStamp, settimeStamp] = useState(new Date());
  const [correctionValue, setcorrectionValue] = useState('');
  const [status, setstatus] = useState('');
  const [value, setValue] = useState('');
  const [masterValue, setMasterValue] = useState([]);
  const [showDatePick, setShowDatePicker] = useState(false);
  function handleClear() {
    sethistoryId('');
    settimeStamp(new Date());
    setcorrectionValue('');
    setstatus('');
  }
  function onChangeStatus(e: any) {
    const regex = /^[a-zA-Z]*$/;
    if (regex.test(e) || e === '') {
      setstatus(e);
    }
  }
  function onChangeValue(e: any) {
    const regex = /^\d*\.?\d*$/;
    if (regex.test(e) || e === '') {
      setcorrectionValue(e);
    }
  }
  const [date, setDate] = useState(new Date());

  // const onChange = ({ type }, selectedDate) => {
  //   if (type == "set") {
  //     const currentdate = selectedDate;
  //     //setDate(currentdate);
  //     settimeStamp(currentdate);
  //     if (Platform.OS === "android") {
  //       settimeStamp(currentdate);
  //     }
  //     showDatePicker();
  //   } else {
  //     showDatePicker();
  //   }
  // };
  const onSaveFunction = async () => {
    var Da = new Date();
    let params = {
      id: 0,
      historyId: historyId,
      timeStamp: timeStamp,
      value: correctionValue,
      statusTags: status,
      correctedValue: correctionValue,
      createdBy: 1,
    };
    console.log('param', params);
    // const db = await connectToDatabase();
    if (historyId != '' && correctionValue != '' && status != '') {
      // addcorrectionDetails(db, params).then(result => {
      //   console.log(result), navigation.navigate('FlatListPage');
      // });

      try {
        AddNewItem(params)
          .then((result: any) => {
            if (result.data != null) {
              navigation.navigate('FlatListPage');
            }
          })
          .catch((error: any) => {
            console.log('Error occurred', error);
            navigation.navigate('LoginPage');
          });
      } catch (error) {
        console.log('Error occured', error);
        navigation.navigate('LoginPage');
      }
    } else {
      Alert.alert('Please Fill the form');
    }
  };
  // var MasterValueData = MasterData;
  useEffect(() => {
    setTimeout(() => {
      masterDatafetch();
    }, 5000);
  }, []);
  const masterDatafetch = () => {
    MasterHistoryData().then(result => {
      setLoading(true);
      setMasterValue(result.data.data);
    }).catch((error: any) => {
      console.log('Error occurred', error);
      navigation.navigate('LoginPage');
    });;
  };
  const onChangeDate = (selectedDate: any) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      settimeStamp(selectedDate);
      // Perform any actions with the selected date
    }
  };
  const [loading, setLoading] = useState(false);
  function LoadingAnimation() {
    return (
      <View style={style.indicatorWrapper}>
        <ActivityIndicator size="large" color={'#999999'} />
        <Text style={style.indicatorText}>Loading </Text>
      </View>
    );
  }
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setisTimePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: any) => {
    //console.log("time",date)
    var newDate = new Date(date);
    console.log("date",date)
    
    const formattedTime = newDate
   // toISOString();
    // undefined, {
    //   hour: '2-digit',
    //   minute: '2-digit',
    //   hour12: false, // Ensure that the time is displayed in 12-hour format (AM/PM)
    // }
    console.log("time",newDate,formattedTime)
    settimeStamp(newDate);
    hideDatePicker();
  };
  const onhandlesample = () => {
    navigation.navigate('storage');
  };
  return (
    <>
      <View style={style.container}>
        
        {loading ? (
          <>
          <TouchableOpacity
          style={[style.buttonupload, style.customButton]}
          onPress={onhandlesample}>
          <Text style={{color: '#fff'}}>Image Upload</Text>
        </TouchableOpacity>
          <View style={style.modalView}>
            <Text style={style.textTitle}>Add New Details</Text>
            {/* <View style={style.insideContainer}> */}
            <View style={style.viewContainer}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  fontSize: 12,
                }}>
                MasterName :
              </Text>
              <Dropdown
                style={style.dropdown}
                placeholderStyle={style.placeholderStyle}
                selectedTextStyle={style.selectedTextStyle}
                inputSearchStyle={style.inputSearchStyle}
                iconStyle={style.iconStyle}
                data={masterValue}
                search
                maxHeight={300}
                labelField="historyId"
                valueField="historyId"
                placeholder="Select item"
                searchPlaceholder="Search..."
                value={historyId}
                onChange={(item: any) => {
                  sethistoryId(item.historyId);
                }}
                // renderLeftIcon={() => (
                //   <AntDesign
                //     style={style.icon}
                //     color="black"
                //     name="Safety"
                //     size={20}
                //   />
                // )}
                renderItem={renderItem}></Dropdown>
            </View>
            {/* <View style={style.insideContainer}>
          <Text style={style.inputTitle}>StatusTag</Text> */}
            <View style={style.viewContainer}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  fontSize: 12,
                }}>
                Status :
              </Text>
              <TextInput
                placeholder="Enter the Status"
                style={style.textInput}
                value={status}
                onChangeText={onChangeStatus}
                maxLength={15}></TextInput>
            </View>
            <View style={style.viewContainer}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  fontSize: 12,
                }}>
                Value :
              </Text>
              <TextInput
                keyboardType="numeric"
                placeholder="Enter the Correction Value"
                style={style.textInput}
                value={correctionValue}
                onChangeText={onChangeValue}
                maxLength={8}></TextInput>
            </View>
            <View style={style.viewContainer}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  fontSize: 12,
                }}>
                TimeStamp :
              </Text>
              <Pressable onPress={() => setDatePickerVisibility(true)}>
                <Text style={style.Datepicker}>Select TimeStamp</Text>
              </Pressable>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
              />
              {/* {showDatePick && (
                <RNDateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"x
                  onChange={onChangeDate}
                />
              )} */}
            </View>

            <View style={style.styleView}>
              <TouchableOpacity
                style={[style.buttonLogin, style.customButton]}
                onPress={onSaveFunction}>
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
          </>
        ) : (
          <LoadingAnimation />
        )}
      </View>
    </>
  );
}
const width = Dimensions.get('window').width - 70;
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  textInput: {
    width: 230,
    height: 40,
    borderRadius: 15,
    paddingLeft: 20,
    borderWidth: 2,
    borderColor: 'blue',
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
    marginLeft: 15,
  },
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  inputTitle: {
    paddingLeft: 20,
    // opacity: 0.5,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'serif',
    fontSize: 15,
    marginRight: 15,
    //marginLeft: 30,
    // justifyContent: "center",
    // alignItems: "baseline",
  },
  styleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalView: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: "white",
  },
  inputarea: {
    flexDirection: 'column',
  },
  buttonCancel: {
    backgroundColor: '#147EFB',
    textAlign: 'center',
    alignItems: 'flex-end',
  },
  buttonupload: {
    backgroundColor: '#147EFB',
    textAlign: 'center',
    alignSelf: 'flex-end',
  },
  customButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 1,
    marginRight: 8,
    borderColor: 'blue',
  },
  insideContainer: {
    flexDirection: 'row',
    textAlign: 'left',
    width: width,
  },
  buttonLogin: {
    backgroundColor: '#69f58e',
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
    textAlign: 'center',
    margin: 15,
  },
  dropdown: {
    margin: 10,
    height: 20,
    backgroundColor: 'lightgray',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    width: 230,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: 'lightgray',
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 11,
  },
  Datepicker: {
    padding: 3,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: 'blue',
    backgroundColor: 'lightgrey',
    //marginRight: 100,
    marginLeft: 8,
    width: 230,
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingLeft: 10,
  },
  dropdownTitle: {
    alignSelf: 'flex-start',
    //paddingLeft: 30,
    marginBottom: 5,
    opacity: 0.5,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'serif',
    fontSize: 15,
    borderColor: 'blue',
    //marginRight: 100,
    marginLeft: 50,
    textAlign: 'center',
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
export default AddNewPage;
