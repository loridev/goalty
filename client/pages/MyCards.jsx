import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useNavigate } from "react-router-native";
import Goal from "../components/GoalList/Goal";
import GoalList from "../components/GoalList/GoalList";
import PrimaryButton from "../components/ui/PrimaryButton";
import GlobalContext from "../context/GlobalContext";
import useDarkMode from "../hooks/useDarkMode";
import { getLoggedInUser } from "../utils/auth";
import socket from "../utils/sockets";

export default function MyCards () {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const { setNavTitle, setGoBack, isAuthenticated } = useContext(GlobalContext);
  const { color } = useDarkMode();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => setUser(await getLoggedInUser() || null))();
    setNavTitle('Cards');
    setGoBack(false);
  }, [refresh]);

  useEffect(() => {
    socket.on('goalupdated', (socketReceived) => {
      console.log(socketReceived);
      setRefresh(!refresh)
    });
  }, [])


  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color
    },
    separator: {
      height: 25,
    }
  })

  return (
    <ScrollView style={styles.container}>
      {user !== null && ((user.role === 'company' && user.company.goals.length !== 0)
      || (user.role === 'customer' && user.goals.length !== 0)) ? (
        user.role === 'company' ? (
          <>
          <PrimaryButton onClick={() => navigate('/creategoal/' + user.company.id)}>Create loyalty card</PrimaryButton>
          <View style={styles.separator}></View>
          <GoalList>
            {user.company.goals.map((el) => (
              <Goal
                key={el.id}
                goal={el}
                isOwn={true}
                companyName={user.company.name}
              />
            ))}
          </GoalList>
          </>

        ) : (
          <GoalList>
            {user.goals.map((el) => (
            <Goal
                key={el.goal_id}
                goal={el.goal}
                isOwn={false}
                companyName={el.goal.company.name}
                progress={`${el.progress}/${el.goal.goal_reach_value}`}
              />
            ))}
          </GoalList>
        )
      ) : (
        <View>
          {user !== null && user.role === 'company' && <PrimaryButton onClick={() => navigate('/creategoal/' + user.company.id)}>Create loyalty card</PrimaryButton>}
          <Text style={styles.title}>You have no loyalty cards {!isAuthenticated && 'because you are not logged in!'}</Text>
        </View>)

      }
    </ScrollView>
  );
}