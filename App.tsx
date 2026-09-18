import { AppNavigator } from './src/navigation/app-navigator';
import { UserProvider } from './src/providers/user-provider';

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}
