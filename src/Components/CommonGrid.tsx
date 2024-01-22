import React, {useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Platform,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';
// import AntDesign from "@expo/vector-icons/AntDesign";
import {Dropdown} from 'react-native-element-dropdown';
import {
  MasterHistoryData,
  deleteCorrection,
  getHistoryCorrection,
  updateCorrectionDetails,
} from '../Services/CommonService';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenType} from '../Screens/StackNavigation';
import RNDateTimePicker from '@react-native-community/datetimepicker';

function CommonGrid(_prop: any) {
  // console.log("Data", _prop);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [historyId, sethistoryId] = useState('');
  const [timeStamp, settimeStamp] = useState('');
  const [correctionValue, setcorrectionValue] = useState(0);
  const [status, setstatus] = useState('');
  const [value, setValue] = useState('');
  const [masterValue, setMasterValue] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const [listValue, setListValue] = useState([]);
  const [deleteModelVisible, setDeleteModelVisible] = useState(false);
  const [showDatePick, setShowDatePicker] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setListValue(_prop.title);
    }, 5000);
  }, [listValue]);
  const showDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };
  const showModal = item => {
    setModalVisible(true);
    setSelectedItem(item);
  };

  const hideModal = () => {
    setModalVisible(false);
  };
  const hideEditModal = () => {
    setEditModalVisible(false);
  };
  const onClickEdit = item => {
    setEditModalVisible(true);
    masterDatafetch();
    sethistoryId(item.historyId);
    settimeStamp(item.timeStamp);
    setDate(new Date(item.timeStamp));
    setstatus(item.statusTags);
    setcorrectionValue(item.correctedValue);
  };
  function onChangeStatus(e: any) {
    const regex = /^[a-zA-Z]*$/;
    if (regex.test(e) || e === '') {
      setstatus(e);
    }
  }
  function onChangeValue(e: any) {
    setcorrectionValue(e);
  }
  const masterDatafetch = () => {
    MasterHistoryData().then(result => {
      setMasterValue(result.data.data);
    });
  };
  const correctionDatafetch = () => {
    getHistoryCorrection().then(result => {
      _prop = result.data.data;
      // console.log("Rerender", _prop);
      setListValue(result.data.data);
    });
  };
  // useFocusEffect(
  //   useCallback(() => {
  //     correctionDatafetch();
  //   }, [])
  // );
  const renderItem = (item: any) => {
    return (
      <View style={style.item}>
        <Text style={style.textItem}>{item.historyId}</Text>
        {item.value === value && (
          <AntDesign style={style.icon} color="black" name="Safety" size={20} />
        )}
      </View>
    );
  };
  const onChange = ({type}, selectedDate) => {
    if (type == 'set') {
      const currentdate = selectedDate;
      setDate(currentdate);
      settimeStamp(currentdate);
      if (Platform.OS === 'android') {
        settimeStamp(currentdate);
      }
      showDatePicker();
    } else {
      showDatePicker();
    }
  };
  const onUpdateDetails = item => {
    let params = {
      id: item.id,
      historyId: historyId,
      timeStamp: timeStamp,
      value: correctionValue,
      statusTags: status,
      correctedValue: correctionValue,
      createdBy: item.createdBy,
      dateCreated: item.dateCreated,
      lastModifiedBy: 1,
      dateModified: new Date(),
    };
    try {
      updateCorrectionDetails(params)
        .then((result: any) => {
          if (result.data.status == 'Success') {
            alert('updated');
            correctionDatafetch();
            setSelectedItem(result.data.data);
            setEditModalVisible(false);
          }
        })
        .catch((error: any) => {
          console.log('Error occurred', error);
        });
    } catch (error) {
      console.log('Error occured', error);
    }
  };
  const onClickDelete = item => {
    setDeleteModelVisible(true);
  };
  const onConfirm = e => {
    console.log('dele', e);
    try {
      deleteCorrection(e.id)
        .then((result: any) => {
          if (result.data.status == 'Success') {
            alert('Deleted Successfully');
            setModalVisible(false);
            correctionDatafetch();
          }
        })
        .catch((error: any) => {
          console.log('Error occurred', error);
        });
    } catch (error) {
      console.log('Error occured', error);
    }
  };
  const onChangeDate = (event, selectedDate) => {
    console.log(selectedDate);
    var newDate = new Date(selectedDate);
    setShowDatePicker(Platform.OS === 'ios');
    if (newDate) {
      //setDate(selectedDate);
      var date = formatDate(newDate);
      settimeStamp(newDate.toDateString);
      setDate(date);
      // Perform any actions with the selected date
    }
  };
  const formatDate = date => {
    return date.toLocaleDateString(); // Or use any date formatting method you prefer
  };
  return (
    <View>
      <View style={[style.gridItem, {backgroundColor: 'lightpink'}]}>
        <Pressable
          android_ripple={{color: '#ccc'}}
          style={({pressed}) => [
            style.button,
            pressed ? style.buttonPressed : null,
          ]}
          onPress={() => showModal(_prop.title)}>
          <View style={style.innerContainer}>
            <Text style={style.title}>{_prop.title.historyId}</Text>
            <AntDesign
              name="rightcircle"
              size={16}
              color="black"
              style={{marginLeft: 10}}
            />
          </View>
        </Pressable>
        {/* <Modal
          animationIn="slideInUp"
          // transparent={true}
          isVisible={modalVisible}
          onModalHide={hideModal}
        > */}
        {/* {modalVisible && (
          <View style={(style.modalView, style.body)}>
            <>
              <View style={{ backgroundColor: "White" }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "darkblue",
                  }}
                >
                  HistoryDataDetails
                </Text>
                <Text>MasterName :{selectedItem.historyId} </Text>
                <Text>TimeStamp :{selectedItem.timeStamp} </Text>
                <Text>Status : {selectedItem.statusTags}</Text>
                <Text>Value : {selectedItem.correctedValue}</Text>
              </View>
              <View style={style.buttonContainer}>
                <Pressable
                  style={[style.buttonClear, style.customButton]}
                  // onPress={hideModal}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Close
                  </Text>
                </Pressable>
                <TouchableOpacity
                  style={[style.buttonLogin, style.customButton]}
                  onPress={() => onClickEdit(selectedItem)}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[style.buttonDelete, style.customButton]}
                  onPress={() => onClickDelete(selectedItem)}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          </View>
        )} */}
        {/* </Modal> */}
      </View>
    </View>
  );
}
const style = StyleSheet.create({
  gridItem: {
    flex: 1,
    //margin: 10,
    height: 50,
    borderRadius: 8,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    marginTop: 4,
    overflow: Platform.OS == 'android' ? 'hidden' : 'visible',
  },
  body: {
    paddingVertical: '3%',
    paddingHorizontal: '2%',
  },

  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 1,
  },
  inputfield: {
    width: 100,
    height: 40,
    borderRadius: 15,
    paddingLeft: 20,
    borderWidth: 2,
    borderColor: 'blue',
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  innerContainer: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  dropdown: {
    margin: 10,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    width: 150,
    // marginLeft: 70,
    //marginRight: 10,
    //marginLeft: 5,
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
  modalView: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  deleteModalView: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  customButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 4,
    marginRight: 4,
    borderColor: 'blue',
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
  buttonLogin: {
    backgroundColor: 'green',
    textAlign: 'center',
    color: 'white',
  },
  buttonDelete: {
    backgroundColor: 'red',
    textAlign: 'center',
  },
  buttonClear: {
    backgroundColor: '#131413',
    textAlign: 'center',
    color: 'white',
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
    padding: 5,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: 'blue',
    backgroundColor: 'gray',
    // marginRight: 100,
    marginLeft: 10,
    width: 150,
    alignContent: 'center',
    justifyContent: 'center',
    //paddingLeft: 15,
  },
  confirmButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});
export default CommonGrid;
