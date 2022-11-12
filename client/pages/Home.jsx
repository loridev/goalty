import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import useDarkMode from "../hooks/useDarkMode";
import { colors, fonts } from "../utils/enums";
import useApiCb from './../hooks/useApiCb';
import UiCard from "../components/ui/UiCard";
import array from "../utils/array";
import GlobalContext from "../context/GlobalContext";
import { useNavigate } from "react-router-native";
import { getLoggedInUser } from "../utils/auth";

export default function Home () {
  const { color } = useDarkMode();
  const { fetchData, isLoading } = useApiCb();
  const [user, setUser] = useState(null);
  const { companies, setNavTitle, setGoBack } = useContext(GlobalContext);
  const [featuredCompany, setFeaturedCompany] = useState(null);
  const navigate = useNavigate();

  const redirToCards = () => {
    setNavTitle('Cards');
    navigate('/mycards');
  }

  const redirToExplore = () => {
    setNavTitle('Explore');
    navigate('/explore');
  }

  const redirToRegister = () => {
    setNavTitle('Account');
    navigate('myaccount');
  }

  useEffect(() => {
    setNavTitle('Home');
    setGoBack(false);
    (async () => {
      setUser(await getLoggedInUser() || null);
    })();
  }, [])

  useEffect(() => {
    (companies !== undefined && companies.length !== 0) && setFeaturedCompany(array.getRandomItem(companies));
  }, [companies]);

  const styles = StyleSheet.create({
    title: {
      fontSize: fonts.welcomeText.size,
      color,
      fontWeight: fonts.welcomeText.weight,
      marginBottom: 10
    },
    allCompanies: {
      flexDirection: 'column',
      marginBottom: 10
    },
    link: {
      color: colors.global.primary.default
    }
  });

  const render = () => {
    if (companies === undefined) return (
        <Text style={styles.title}>
          There are no companies! You can <Text style={styles.link} onPress={redirToRegister}>create one!</Text>
        </Text>
      );

    return (
      <>
      <Text style={styles.title}>
        Welcome{user !== null && ` back ${user.first_name} ${user.last_name}`}!
      </Text>
      <Text style={styles.title}>
        Check out our featured company:
      </Text>
      {featuredCompany !== null && <UiCard
        title={featuredCompany.name}
        description="Lorem ipsum"
        buttonText="VISIT"
        goalCount={featuredCompany.goals.length}
        onClickButton={() => navigate(`/company/${featuredCompany.id}`)}
        />}
      <Text style={styles.title}>
        Or check all the companies:
      </Text>
      {companies.length !== 0 && companies
        .map(el => <UiCard 
          key={el.id}
          title={el.name}
          description={el.description}
          buttonText="VISIT"
          goalCount={el.goals.length}
          onClickButton={() => navigate(`/company/${el.id}`)}
          />)}
      <Text style={styles.title}>
        Still don't know what to do? Check the cards page <Text style={styles.link} onPress={redirToCards}>here</Text>
      </Text>

      <Text style={styles.title}>
        You can also see <Text style={styles.link} onPress={redirToExplore}>what companies are close to you</Text>
      </Text>
      </>
    )
  }

  return (
    <ScrollView>
      {render()}
    </ScrollView>
  );
}