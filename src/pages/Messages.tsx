
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Paperclip } from "lucide-react";
import { ChatContact, ChatMessage } from "@/types/message";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import MessageCallButtons from "@/components/MessageCallButtons";
import { playNewMessageSound } from "@/services/soundService";
import { useLocation } from "react-router-dom";
import MessageInput from "@/components/MessageInput";

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const initialContactId = location.state?.contactId;
  
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const mockContacts: ChatContact[] = [
      {
        id: "1",
        name: "Sophie Chen",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
        lastActive: new Date(Date.now() - 300000).toISOString(),
        isOnline: true,
        preferredLanguage: "en",
        lastMessage: {
          text: "Are we still meeting tomorrow?",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          isFromContact: true,
          read: false,
        },
        videoCallEnabled: true,
        voiceCallEnabled: true,
        verificationStatus: "verified",
      },
      {
        id: "2",
        name: "James Wilson",
        imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
        lastActive: new Date(Date.now() - 80000000).toISOString(),
        isOnline: false,
        lastMessage: {
          text: "Great time yesterday!",
          timestamp: new Date(Date.now() - 80000000).toISOString(),
          isFromContact: true,
          read: true,
        },
        videoCallEnabled: true,
        voiceCallEnabled: true,
      },
      {
        id: "3",
        name: "Olivia Martinez",
        imageUrl: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80",
        lastActive: new Date(Date.now() - 3600000).toISOString(),
        isOnline: true,
        preferredLanguage: "es",
        lastMessage: {
          text: "I'll send you the location",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isFromContact: false,
          read: true,
        },
        videoCallEnabled: false,
        voiceCallEnabled: true,
      },
    ];

    setContacts(mockContacts);
    
    // Select contact if ID is passed through location state
    if (initialContactId) {
      const contact = mockContacts.find(c => c.id === initialContactId);
      if (contact) {
        setSelectedContact(contact);
      }
    }
  }, [initialContactId]);

  useEffect(() => {
    if (selectedContact) {
      const mockMessages: ChatMessage[] = [
        {
          id: "1",
          senderId: selectedContact.id,
          text: "Hey there! How's your day going?",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true,
        },
        {
          id: "2",
          senderId: "currentUser",
          text: "It's good! Just busy with work. How about you?",
          timestamp: new Date(Date.now() - 3500000).toISOString(),
          read: true,
        },
        {
          id: "3",
          senderId: selectedContact.id,
          text: "I'm doing well! Just finished my workout.",
          timestamp: new Date(Date.now() - 3400000).toISOString(),
          read: true,
        },
        {
          id: "4",
          senderId: "currentUser",
          text: "That's great! I've been meaning to get back to the gym.",
          timestamp: new Date(Date.now() - 3300000).toISOString(),
          read: true,
        },
        {
          id: "5",
          senderId: selectedContact.id,
          text: selectedContact.lastMessage?.isFromContact ? selectedContact.lastMessage.text : "Let me know when you're free!",
          timestamp: new Date(Date.now() - (selectedContact.lastMessage?.isFromContact ? 300000 : 3200000)).toISOString(),
          read: selectedContact.lastMessage?.isFromContact ? false : true,
        },
      ];

      if (!selectedContact.lastMessage?.isFromContact) {
        mockMessages.push({
          id: "6",
          senderId: "currentUser",
          text: selectedContact.lastMessage?.text || "I'll let you know!",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          read: true,
        });
      }

      setMessages(mockMessages);
    }
  }, [selectedContact]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (messageText: string) => {
    if (messageText.trim() && selectedContact) {
      const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: "currentUser",
        text: messageText,
        timestamp: new Date().toISOString(),
        read: false,
      };

      setMessages([...messages, message]);

      setContacts(contacts.map(contact => 
        contact.id === selectedContact.id
          ? {
              ...contact,
              lastMessage: {
                text: messageText,
                timestamp: new Date().toISOString(),
                isFromContact: false,
                read: true,
              }
            }
          : contact
      ));
    }
  };

  const simulateIncomingMessage = () => {
    if (selectedContact) {
      const incomingMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: selectedContact.id,
        text: "Hey, just checking in! How are you doing today?",
        timestamp: new Date().toISOString(),
        read: false,
      };

      setMessages(prev => [...prev, incomingMessage]);
      
      setContacts(contacts.map(contact => 
        contact.id === selectedContact.id
          ? {
              ...contact,
              lastMessage: {
                text: incomingMessage.text,
                timestamp: incomingMessage.timestamp,
                isFromContact: true,
                read: false,
              }
            }
          : contact
      ));
      
      playNewMessageSound();
    }
  };

  useEffect(() => {
    if (selectedContact) {
      const timer = setInterval(() => {
        simulateIncomingMessage();
      }, 45000);
      
      return () => clearInterval(timer);
    }
  }, [selectedContact]);

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  const formatLastActive = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours < 24) {
      return `Last active ${format(date, 'h:mm a')}`;
    } else {
      return `Last active ${format(date, 'MMM d, yyyy')}`;
    }
  };

  return (
    <div className="container py-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 border rounded-lg overflow-hidden bg-card">
          <div className="p-4 border-b">
            <Input 
              placeholder="Search contacts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="divide-y overflow-auto max-h-[600px]">
            {filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <div 
                  key={contact.id}
                  className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-accent/50 ${selectedContact?.id === contact.id ? 'bg-accent' : ''}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.imageUrl} alt={contact.name} />
                      <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{contact.name}</h3>
                      {contact.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(contact.lastMessage.timestamp), 'h:mm a')}
                        </span>
                      )}
                    </div>
                    {contact.lastMessage && (
                      <p className={`text-sm truncate ${!contact.lastMessage.read && contact.lastMessage.isFromContact ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                        {contact.lastMessage.isFromContact ? '' : 'You: '}
                        {contact.lastMessage.text}
                      </p>
                    )}
                  </div>
                  {contact.lastMessage && !contact.lastMessage.read && contact.lastMessage.isFromContact && (
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No contacts found
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2 border rounded-lg overflow-hidden bg-card flex flex-col h-[600px]">
          {selectedContact ? (
            <>
              <div className="p-3 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedContact.imageUrl} alt={selectedContact.name} />
                    <AvatarFallback>{selectedContact.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedContact.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedContact.isOnline ? 'Online' : formatLastActive(selectedContact.lastActive)}
                    </p>
                  </div>
                </div>
                <MessageCallButtons contact={selectedContact} />
              </div>
              
              <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.senderId === "currentUser" ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === "currentUser" 
                          ? 'bg-primary text-primary-foreground rounded-br-none' 
                          : 'bg-muted rounded-bl-none'
                      }`}
                    >
                      <p>{message.text}</p>
                      <div 
                        className={`text-xs mt-1 ${
                          message.senderId === "currentUser" 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}
                      >
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground p-4 text-center">
              <div>
                <h3 className="font-medium mb-2">Select a conversation</h3>
                <p>Choose a contact to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
