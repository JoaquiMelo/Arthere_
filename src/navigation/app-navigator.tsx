import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreatePortfolioScreen from '../features/auth/screens/create-portfolio-screen';
import CustomizeProfileScreen from '../features/auth/screens/customize-profile-screen';
import LoginScreen from '../features/auth/screens/login-screen';
import RegisterScreen from '../features/auth/screens/register-screen';
import ChatConversationScreen from '../features/chat/screens/chat-conversation-screen';
import ChatListScreen from '../features/chat/screens/chat-list-screen';
import { MapScreen } from '../features/map/screens/map-screen';
import ManageOpportunitiesScreen from '../features/opportunities/screens/manage-opportunities-screen';
import OpportunitiesScreen from '../features/opportunities/screens/opportunities-screen';
import EditContractorProfileScreen from '../features/profile/screens/edit-contractor-profile-screen';
import EditProfileScreen from '../features/profile/screens/edit-profile-screen';
import PortfolioCreationScreen from '../features/profile/screens/portfolio-creation-screen';
import ProfileScreen from '../features/profile/screens/profile-screen';
import SettingsScreen from '../features/profile/screens/settings-screen';
import EventsScreen from '../features/events/screens/events-screen';
import { colors } from '../shared/theme/colors';

type RootStackParamList={Login:undefined;Register:undefined;CreatePortfolio:undefined;CustomizeProfile:undefined;Tabs:undefined;EditProfile:undefined;EditContractorProfile:undefined;PortfolioCreation:undefined;Settings:undefined;ChatConversation:{conversationId:string};ManageOpportunities:undefined;Events:undefined};
type TabParamList={Map:undefined;Profile:undefined;Opportunities:undefined;Settings:undefined;Chat:undefined;Events:undefined};
const Stack=createNativeStackNavigator<RootStackParamList>(); const Tab=createBottomTabNavigator<TabParamList>();
function AppTabs(){return <Tab.Navigator screenOptions={({route})=>({headerShown:false,tabBarActiveTintColor:colors.danger,tabBarInactiveTintColor:colors.muted,tabBarStyle:{height:64,paddingBottom:8,paddingTop:8,borderTopColor:colors.orange,borderTopWidth:2,backgroundColor:colors.white},tabBarIcon:({color,size})=><Ionicons name={({Map:'map-outline',Profile:'person-outline',Opportunities:'briefcase-outline',Settings:'settings-outline',Chat:'chatbubbles-outline',Events:'calendar-outline'} as const)[route.name]} size={size} color={color}/>})}>
<Tab.Screen name="Map" component={MapScreen} options={{title:'Mapa'}}/><Tab.Screen name="Profile" component={ProfileScreen} options={{title:'Perfil'}}/><Tab.Screen name="Opportunities" component={OpportunitiesScreen} options={{title:'Vagas'}}/><Tab.Screen name="Events" component={EventsScreen} options={{title:'Eventos'}}/><Tab.Screen name="Chat" component={ChatListScreen} options={{title:'Chat'}}/>
</Tab.Navigator>}
export function AppNavigator(){return <NavigationContainer><Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}><Stack.Screen name="Login" component={LoginScreen}/><Stack.Screen name="Register" component={RegisterScreen}/><Stack.Screen name="CreatePortfolio" component={CreatePortfolioScreen}/><Stack.Screen name="CustomizeProfile" component={CustomizeProfileScreen}/><Stack.Screen name="Tabs" component={AppTabs}/><Stack.Screen name="EditProfile" component={EditProfileScreen}/><Stack.Screen name="EditContractorProfile" component={EditContractorProfileScreen}/><Stack.Screen name="PortfolioCreation" component={PortfolioCreationScreen}/><Stack.Screen name="Settings" component={SettingsScreen}/><Stack.Screen name="ChatConversation" component={ChatConversationScreen}/><Stack.Screen name="ManageOpportunities" component={ManageOpportunitiesScreen}/><Stack.Screen name="Events" component={EventsScreen}/></Stack.Navigator></NavigationContainer>;}
