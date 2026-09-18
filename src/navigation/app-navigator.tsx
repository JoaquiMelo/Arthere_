import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CreatePortfolioScreen from '../features/auth/screens/create-portfolio-screen';
import CustomizeProfileScreen from '../features/auth/screens/customize-profile-screen';
import LoginScreen from '../features/auth/screens/login-screen';
import RegisterScreen from '../features/auth/screens/register-screen';
import { MapScreen } from '../features/map/screens/map-screen';
import OpportunitiesScreen from '../features/opportunities/screens/opportunities-screen';
import EditProfileScreen from '../features/profile/screens/edit-profile-screen';
import PortfolioCreationScreen from '../features/profile/screens/portfolio-creation-screen';
import ProfileScreen from '../features/profile/screens/profile-screen';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  CreatePortfolio: undefined;
  CustomizeProfile: undefined;
  Tabs: undefined;
  EditProfile: undefined;
  PortfolioCreation: undefined;
};

type TabParamList = {
  Map: undefined;
  Profile: undefined;
  Opportunities: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#EC1B4B',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Map: 'map-outline',
            Profile: 'person-outline',
            Opportunities: 'briefcase-outline',
          } as const;

          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Mapa' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      <Tab.Screen name="Opportunities" component={OpportunitiesScreen} options={{ title: 'Vagas' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="CreatePortfolio" component={CreatePortfolioScreen} />
        <Stack.Screen name="CustomizeProfile" component={CustomizeProfileScreen} />
        <Stack.Screen name="Tabs" component={AppTabs} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="PortfolioCreation" component={PortfolioCreationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
