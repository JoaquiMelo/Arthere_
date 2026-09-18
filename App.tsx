import { AppNavigator } from './src/navigation/app-navigator';
import { UserProvider } from './src/providers/user-provider';
import { ChatProvider } from './src/providers/chat-provider';

export default function App() {
  return (
    <UserProvider>
      <ChatProvider>
        <AppNavigator />
      </ChatProvider>
    </UserProvider>
  );
}
