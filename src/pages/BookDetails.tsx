import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MessageSquare, Heart, Share2, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchBookDetails();
    
    // Set up real-time subscription for messages
    if (user && id) {
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `book_id=eq.${id}`
          },
          (payload) => {
            console.log('New message received:', payload);
            setMessages(prev => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id, user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchBookDetails = async () => {
    try {
      // Fetch book details
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select(`
          *,
          profiles:owner_id (
            id,
            name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (bookError) throw bookError;
      setBook(bookData);

      // Fetch similar books
      const { data: similarData } = await supabase
        .from('books')
        .select(`
          *,
          profiles:owner_id (
            id,
            name,
            avatar_url
          )
        `)
        .eq('category', bookData.category)
        .neq('id', id)
        .limit(4);

      setSimilarBooks(similarData || []);

      // Fetch messages if user is authenticated
      if (user) {
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id (
              id,
              name,
              avatar_url
            ),
            receiver:receiver_id (
              id,
              name,
              avatar_url
            )
          `)
          .eq('book_id', id)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;
        console.log('Fetched messages:', messagesData);
        setMessages(messagesData || []);
      }
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('Error loading book details');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sendingMessage) return;

    try {
      setSendingMessage(true);
      const messageData = {
        book_id: id,
        sender_id: user.id,
        receiver_id: book.owner_id,
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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-gray-600">Book not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Book details section remains the same */}
      
      {/* Chat Section */}
      {user && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Messages</h2>
          <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
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
                    <p className="text-sm font-medium mb-1">
                      {message.sender?.name || 'Unknown User'}
                    </p>
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
      )}

      {/* Similar Books section remains the same */}
    </div>
  );
}