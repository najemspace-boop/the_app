import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Send, Paperclip, Mic, Image, FileText, Download, Play, Pause } from 'lucide-react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ChatInterface = ({ chatId, otherUserId, otherUserName }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      const messagesQuery = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('createdAt', 'asc')
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesData = [];
        snapshot.forEach((doc) => {
          messagesData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setMessages(messagesData);
        scrollToBottom();
      });

      return unsubscribe;
    }
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageData) => {
    if (!chatId || !user) return;

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: user.uid,
        receiverId: otherUserId,
        ...messageData,
        delivered: false,
        read: false,
        createdAt: serverTimestamp()
      });

      // Update chat last message
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: messageData.type === 'text' ? messageData.content : `Sent ${messageData.type}`,
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleSendText = async () => {
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    
    await sendMessage({
      type: 'text',
      content: messageContent
    });
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file size (max 1.5MB)
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error('File must be less than 1.5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, and PDF files are allowed');
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `chat-attachments/${chatId}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await sendMessage({
        type: 'attachment',
        content: file.name,
        attachmentUrl: downloadURL,
        attachmentType: file.type,
        attachmentSize: file.size
      });

      toast.success('File sent successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        
        // Validate duration (max 1 minute)
        if (blob.size > 1024 * 1024) { // Rough size check for 1 minute
          toast.error('Voice message must be less than 1 minute');
          return;
        }

        setUploading(true);
        try {
          const storageRef = ref(storage, `voice-messages/${chatId}/${Date.now()}.webm`);
          const snapshot = await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(snapshot.ref);

          await sendMessage({
            type: 'voice',
            content: 'Voice message',
            voiceUrl: downloadURL,
            duration: Math.floor(blob.size / 1000) // Rough duration estimate
          });

          toast.success('Voice message sent');
        } catch (error) {
          console.error('Error uploading voice message:', error);
          toast.error('Failed to send voice message');
        } finally {
          setUploading(false);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setMediaRecorder(null);
      setRecording(false);
    }
  };

  const MessageBubble = ({ message }) => {
    const isOwn = message.senderId === user.uid;
    const [playing, setPlaying] = useState(false);

    const handlePlayVoice = () => {
      if (message.type === 'voice') {
        const audio = new Audio(message.voiceUrl);
        setPlaying(true);
        audio.play();
        audio.onended = () => setPlaying(false);
      }
    };

    const renderMessageContent = () => {
      switch (message.type) {
        case 'text':
          return <p className="text-sm">{message.content}</p>;
        
        case 'attachment':
          if (message.attachmentType?.startsWith('image/')) {
            return (
              <div className="space-y-2">
                <img
                  src={message.attachmentUrl}
                  alt={message.content}
                  className="max-w-xs rounded-lg"
                />
                <p className="text-xs text-gray-500">{message.content}</p>
              </div>
            );
          } else {
            return (
              <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
                <FileText className="h-4 w-4" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{message.content}</p>
                  <p className="text-xs text-gray-500">
                    {(message.attachmentSize / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(message.attachmentUrl, '_blank')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            );
          }
        
        case 'voice':
          return (
            <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
              <Button
                size="sm"
                variant="ghost"
                onClick={handlePlayVoice}
                disabled={playing}
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div className="flex-1">
                <p className="text-sm">Voice message</p>
                <p className="text-xs text-gray-500">{message.duration}s</p>
              </div>
            </div>
          );
        
        default:
          return <p className="text-sm">{message.content}</p>;
      }
    };

    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isOwn
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-900'
          }`}
        >
          {renderMessageContent()}
          <div className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
            {format(message.createdAt?.toDate() || new Date(), 'HH:mm')}
            {isOwn && (
              <span className="ml-1">
                {message.read ? '✓✓' : message.delivered ? '✓' : '○'}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          Chat with {otherUserName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              className="hidden"
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={recording ? stopRecording : startRecording}
              disabled={uploading}
              className={recording ? 'text-red-600' : ''}
            >
              <Mic className="h-4 w-4" />
            </Button>

            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={recording ? 'Recording...' : 'Type a message...'}
              onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
              disabled={loading || uploading || recording}
              className="flex-1"
            />

            <Button
              onClick={handleSendText}
              disabled={!newMessage.trim() || loading || uploading || recording}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {(uploading || recording) && (
            <div className="mt-2 text-sm text-gray-500">
              {uploading && 'Uploading...'}
              {recording && 'Recording... Click mic to stop'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
