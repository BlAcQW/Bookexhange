import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MessageSquare, User, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  book_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  sender?: {
    name: string;
    avatar_url?: string;
  };
  receiver?: {
    name: string;
    avatar_url?: string;
  };
  book?: {
    title: string;
    image_url?: string;
  };
}

export function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (
            name,
            avatar_url
          ),
          receiver:receiver_id (
            name,
            avatar_url
          ),
          book:book_id (
            title,
            image_url
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id},receiver_id=eq.${user.id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedBookId || sendingMessage) return;

    try {
      setSendingMessage(true);
      const book = messages.find(m => m.book_id === selectedBookId);
      if (!book) return;

      const messageData = {
        book_id: selectedBookId,
        sender_id: user.id,
        receiver_id: book.sender_id === user.id ? book.receiver_id : book.sender_id,
        message: newMessage.trim()
      };

      const { error: sendError } = await supabase
        .from('messages')
        .insert(messageData);

      if (sendError) throw sendError;
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Group messages by book
  const messagesByBook = messages.reduce((acc, message) => {
    if (!acc[message.book_id]) {
      acc[message.book_id] = [];
    }
    acc[message.book_id].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Messages</h1>

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Books List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Conversations</h2>
          {Object.entries(messagesByBook).map(([bookId, bookMessages]) => {
            const lastMessage = bookMessages[bookMessages.length - 1];
            const book = lastMessage.book;
            const otherUser = lastMessage.sender_id === user.id ? lastMessage.receiver : lastMessage.sender;

            return (
              <motion.div
                key={bookId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedBookId === bookId
                    ? 'bg-primary/10 dark:bg-primary-light/10'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setSelectedBookId(bookId)}
              >
                <div className="flex items-center gap-4">
                  {book?.image_url ? (
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Book className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {book?.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {otherUser?.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(lastMessage.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Messages */}
        <div className="lg:col-span-2">
          {selectedBookId ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              {/* Selected Book Info */}
              {messages.find(m => m.book_id === selectedBookId)?.book && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <Link
                    to={`/books/${selectedBookId}`}
                    className="flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
                  >
                    <img
                      src={messages.find(m => m.book_id === selectedBookId)?.book?.image_url}
                      alt={messages.find(m => m.book_id === selectedBookId)?.book?.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {messages.find(m => m.book_id === selectedBookId)?.book?.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        View Book Details
                      </p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Messages List */}
              <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                <AnimatePresence initial={false}>
                  {messagesByBook[selectedBookId]?.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${
                        message.sender_id === user.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender_id === user.id
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender?.avatar_url ? (
                            <img
                              src={message.sender.avatar_url}
                              alt={message.sender.name}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                          <p className="text-sm font-medium">
                            {message.sender?.name}
                          </p>
                        </div>
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </AnimatePresence>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSendMessage} className="flex gap-4">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sendingMessage}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={sendingMessage}
                    isLoading={sendingMessage}
                  >
                    Send
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[600px] bg-white dark:bg-gray-800 rounded-lg">
              <MessageSquare className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Select a conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a book conversation from the list to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}