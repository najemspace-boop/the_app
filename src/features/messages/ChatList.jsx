import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { MessageSquare, Search, User } from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { format } from 'date-fns';

const ChatList = ({ onChatSelect, selectedChatId }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  const fetchChats = () => {
    if (!user) return;

    const chatsQuery = query(
      collection(db, 'chats'),
      where('participantIds', 'array-contains', user.uid),
      orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
      const chatsData = [];
      
      for (const docSnapshot of snapshot.docs) {
        const chatData = { id: docSnapshot.id, ...docSnapshot.data() };
        
        // Get other participant's info
        const otherParticipantId = chatData.participantIds.find(id => id !== user.uid);
        if (otherParticipantId) {
          try {
            const userDoc = await getDoc(doc(db, 'profiles', otherParticipantId));
            if (userDoc.exists()) {
              chatData.otherUser = userDoc.data();
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
        
        chatsData.push(chatData);
      }
      
      setChats(chatsData);
      setLoading(false);
    });

    return unsubscribe;
  };

  const filteredChats = chats.filter(chat => {
    if (!searchTerm) return true;
    const otherUserName = chat.otherUser?.displayName || chat.otherUser?.email || '';
    return otherUserName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const ChatItem = ({ chat }) => {
    const isSelected = selectedChatId === chat.id;
    const hasUnread = chat.unreadCount && chat.unreadCount[user.uid] > 0;

    return (
      <div
        onClick={() => onChatSelect(chat)}
        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
          isSelected ? 'bg-primary-50 border-primary-200' : ''
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {chat.otherUser?.avatar ? (
              <img
                src={chat.otherUser.avatar}
                alt={chat.otherUser.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-gray-500" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className={`text-sm font-medium truncate ${hasUnread ? 'font-bold' : ''}`}>
                {chat.otherUser?.displayName || chat.otherUser?.email || 'Unknown User'}
              </h4>
              {chat.lastMessageAt && (
                <span className="text-xs text-gray-500">
                  {format(chat.lastMessageAt.toDate(), 'MMM d')}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <p className={`text-sm text-gray-600 truncate ${hasUnread ? 'font-medium' : ''}`}>
                {chat.lastMessage || 'No messages yet'}
              </p>
              {hasUnread && (
                <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {chat.unreadCount[user.uid]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="h-[600px]">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Messages</span>
        </CardTitle>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-0">
        {filteredChats.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No conversations yet</p>
            <p className="text-sm">Start chatting with hosts or guests!</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ChatItem key={chat.id} chat={chat} />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ChatList;
