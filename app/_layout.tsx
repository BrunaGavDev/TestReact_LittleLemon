import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useMemo, useReducer } from "react";
import { Alert } from "react-native";
import Onboarding  from "./Onboarding.js";
import Profile  from "./Profile.js";
import SplashScreen from "./SplashScreen.js";
import Home  from "./Home";
import StatusBar from "expo-status-bar";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "../contexts/AuthContext";
 
const Stack = createNativeStackNavigator();


export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "home",

  auth: { // <= important!
    initialRouteName: "home", // <= important!
  },
};

export default function RootLayout( ) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "onboard":
          return {
            ...prevState,
            isLoading: false,
            isOnboardingCompleted: action.isOnboardingCompleted,
          };
      }
    },
    {
      isLoading: true,
      isOnboardingCompleted: false,
    }
  );

  useEffect(() => {
    (async () => {
      let profileData = [];
      try {
        const getProfile = await AsyncStorage.getItem("profile");
        if (getProfile !== null) {
          profileData.push( getProfile);  //aggiornato
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (Object.keys(profileData).length != 0) {
          dispatch({ type: "onboard", isOnboardingCompleted: true });
        } else {
          dispatch({ type: "onboard", isOnboardingCompleted: false });
        }
      }
    })();
  }, []);

  const authContext = useMemo(
    () => ({
      onboard: async (data) => {
        try {
          const jsonValue = JSON.stringify(data);
          await AsyncStorage.setItem("profile", jsonValue);
        } catch (e) {
          console.error(e);
        }

        dispatch({ type: "onboard", isOnboardingCompleted: true });
      },
      update: async (data) => {
        try {
          const jsonValue = JSON.stringify(data);
          await AsyncStorage.setItem("profile", jsonValue);
        } catch (e) {
          console.error(e);
        }

        Alert.alert("Success", "Successfully saved changes!");
      },
      logout: async () => {
        try {
          await AsyncStorage.clear();
        } catch (e) {
          console.error(e);
        }

        dispatch({ type: "onboard", isOnboardingCompleted: false });
      },
    }),
    []
  );

  if (state.isLoading) {
    return <SplashScreen />;
  }
//<StatusBar style="dark" />
  return (
    <AuthContext.Provider value={authContext}>
      
      
        <Stack.Navigator>
          {state.isOnboardingCompleted ? (
            <>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Profile" component={Profile} />
            </>
          ) : (
            <Stack.Screen
              name="Onboarding"
              component={Onboarding}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      
    </AuthContext.Provider>
  );
}
