
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { ChatContact, ChatMessage } from "@/types/message";
import { useToast } from "@/hooks/use-toast";
import { playNewMessageSound } from "@/services/soundService";
import { useLocation } from "react-router-dom";
import MessageInput from "@/components/MessageInput";
import { useCall } from "@/contexts/CallContext";
import CallUI from "@/components/CallUI";
import ContactList from "@/components/messages/ContactList";
import ConversationHeader from "@/components/messages/ConversationHeader";
import MessageDisplay from "@/components/messages/MessageDisplay";

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const initialContactId = location.state?.contactId;
  const { startCall } = useCall();
  
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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

  const handleStartVoiceCall = () => {
    if (selectedContact) {
      startCall(selectedContact.id, "voice");
    }
  };

  const handleStartVideoCall = () => {
    if (selectedContact) {
      startCall(selectedContact.id, "video");
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

  return (
    <div className="container py-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ContactList 
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
        />
        
        <div className="md:col-span-2 border rounded-lg overflow-hidden bg-card flex flex-col h-[600px]">
          {selectedContact ? (
            <>
              <ConversationHeader 
                contact={selectedContact}
                onStartVoiceCall={handleStartVoiceCall}
                onStartVideoCall={handleStartVideoCall}
              />
              
              <MessageDisplay 
                messages={messages} 
                selectedContactName={selectedContact.name} 
              />
              
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
      
      {/* Call UI */}
      <CallUI 
        contactName={selectedContact?.name} 
        contactImage={selectedContact?.imageUrl} 
      />
    </div>
  );
};

export default Messages;
