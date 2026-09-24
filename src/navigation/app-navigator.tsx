import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CreatePortfolioScreen from '../features/auth/screens/create-portfolio-screen';
import CustomizeProfileScreen from '../features/auth/screens/customize-profile-screen';
import LoginScreen from '../features/auth/screens/login-screen';
import RegisterScreen from '../features/auth/screens/register-screen';
import ChatConversationScreen from '../features/chat/screens/chat-conversation-screen';
import ChatListScreen from '../features/chat/screens/chat-list-screen';
import EventDetailsScreen from '../features/events/screens/event-details-screen';
import EventsScreen from '../features/events/screens/events-screen';
import { MapScreen } from '../features/map/screens/map-screen';
import ManageOpportunitiesScreen from '../features/opportunities/screens/manage-opportunities-screen';
import EditContractorProfileScreen from '../features/profile/screens/edit-contractor-profile-screen';
import EditProfileScreen from '../features/profile/screens/edit-profile-screen';
import PortfolioCreationScreen from '../features/profile/screens/portfolio-creation-screen';
import ProfileScreen from '../features/profile/screens/profile-screen';
import SettingsScreen from '../features/profile/screens/settings-screen';
import { useTheme } from '../providers/theme-provider';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  CreatePortfolio: undefined;
  CustomizeProfile: undefined;
  Tabs: undefined;
  EditProfile: undefined;
  EditContractorProfile: undefined;
  PortfolioCreation: undefined;
  Settings: undefined;
  ChatConversation: { conversationId: string };
  ManageOpportunities: undefined;
  Events: undefined;
  EventDetails: { eventId: string };
};

export type TabParamList = {
  Map: undefined;
  Profile: undefined;
  Opportunities: undefined;
  Settings: undefined;
  Chat: undefined;
  Events: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const icons: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  Map: 'map-outline',
  Profile: 'person-outline',
  Opportunities: 'briefcase-outline',
  Events: 'calendar-outline',
  Chat: 'chatbubble-ellipses-outline',
  Settings: 'settings-outline',
};

function AppTabs() {
  const { palette } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.brandCoral,
        tabBarInactiveTintColor: palette.brandPaper,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          letterSpacing: 0.7,
          textTransform: 'uppercase',
        },
        tabBarStyle: {
          height: 70,
          paddingTop: 7,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: palette.brandCoral,
          backgroundColor: palette.brandInk,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? icons[route.name as keyof TabParamList].replace('-outline', '') as keyof typeof Ionicons.glyphMap : icons[route.name as keyof TabParamList]}
            size={focused ? 23 : 21}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Mapa' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      <Tab.Screen name="Events" component={EventsScreen} options={{ title: 'Eventos' }} />
      <Tab.Screen name="Chat" component={ChatListScreen} options={{ title: 'Chat' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Config.' }} />
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
        <Stack.Screen name="EditContractorProfile" component={EditContractorProfileScreen} />
        <Stack.Screen name="PortfolioCreation" component={PortfolioCreationScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
        <Stack.Screen name="ManageOpportunities" component={ManageOpportunitiesScreen} />
        <Stack.Screen name="Events" component={EventsScreen} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
