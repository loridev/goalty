import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigate, useParams } from "react-router-native";
import GlobalContext from "../../context/GlobalContext";
import useApiCb from "../../hooks/useApiCb";
import useDarkMode from "../../hooks/useDarkMode";
import { api, fonts, forms, toastTypes } from "../../utils/enums";
import Form from "../Form/Form";
import PrimaryButton from "../ui/PrimaryButton";
import UiModal from "../ui/UiModal";
import { NdefTools } from 'react-native-nfc-sdk';
import { showToast } from "../../utils/toast";

export default function AddGoal () {
  let { goal } = useParams();
  const { backgroundColor, color } = useDarkMode();
  const [goalState, setGoalState] = useState(goal);
  const { fetchData, isLoading } = useApiCb();
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const { setNavTitle, setGoBack } = useContext(GlobalContext);
  const toggleModal = () => setIsModalVisible(!isModalVisible);
  const [user, setUser] = useState(null)
  const ndef = new NdefTools();
  const [modalText, setModalText] = useState('');
  const navigate = useNavigate();

  const styles = StyleSheet.create({
    text: {
      fontSize: fonts.addGoal.text.size,
      fontWeight: fonts.addGoal.text.weight,
      marginBottom: 25,
      color
    },
    modalContent: {
      backgroundColor,
      padding: 20,
      borderRadius: 10
    },
    modalText: {
      textAlign: 'center',
      color,
      marginBottom: 30,
      fontSize: 20
    }
  });

  const handleSubmit = (values) => {
    const url = api.baseUrl + api.v1prefix + api.userPrefix + '/username/' + values.username;
    console.log(url);

    fetchData(url, null, (err, data) => {
      console.log(data);
      if (!err && data.status < 400) {
        createCard(data.data);
      } else {
        showToast(toastTypes.error, 'User not found', 'Check the username you typed');
      }
    })
  }

  const closeModal = () => {
    try {
      ndef.cancelRequest();
    } catch (err) {}
    toggleModal();
  }

  const createCard = async (user) => {
    setModalText('Pass the card through the reader to assign it to the user');
    toggleModal();
    try {
      await ndef.writeTag(user.id);
      showToast(toastTypes.success, 'Card written correctly!', 'Card was succeesfully linked to user with username ' + user.username);
      navigate(-1);
    } catch (err) {
      showToast(toastTypes.error, 'There was an error writing the card', 'Try to hold the card close to the reader for a second next time');
      console.log('Error writing card: ', err);
    }
    closeModal();
  }

  const addGoalToUser = async () => {
    setModalText('Pass the card through the reader to update the goal in the user');
    toggleModal();
    try {
      const nfcCard = await ndef.readTag();
      toggleModal();
      const url = api.baseUrl + api.v1prefix + api.userPrefix + '/' 
        + nfcCard.content + api.goalPrefix + '/' + goalState.id;
      fetchData(url, {method: 'POST'}, (err, data) => {
        if (!err && data.status === 200) {
          if (data.completed) showToast(toastTypes.success, 'Goal completed!', 'The card you just passed completed your goal');
          navigate(-1);
          return;
        }
        throw new Error('Something went wrong');
      })
    } catch (err) {
      showToast(toastTypes.error, 'There was an error updating the goal to the user', 'Make sure the card is linked to a user');
      console.log(err);
    }
    closeModal();
  }

  useEffect(() => {
    setNavTitle('Create / update card');
    setGoBack(true);
    setGoalState(JSON.parse(goal));
  }, []);

  return (
    <>
      <Text style={styles.text}>You are going to add the following goal: "{goalState.name}"</Text>
      {goalState.new === true ? (
        <Form title="Type the user's username to create the card" onSubmit={handleSubmit} inputs={forms.addGoal}
        isButtonDisabled={isLoading}/>
      ) : (
        <PrimaryButton onClick={addGoalToUser}>Scan card</PrimaryButton>
      )
      }

      <UiModal isVisible={isModalVisible} onBackButtonPress={closeModal} onBackdropPress={closeModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalText}</Text>

            <PrimaryButton onClick={toggleModal}>Close modal</PrimaryButton>

          </View>
      </UiModal>
    </>
  )
}