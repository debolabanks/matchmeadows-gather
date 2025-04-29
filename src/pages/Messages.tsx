
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send } from "lucide-react";

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  imageUrl: string;
  lastActive: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    isFromContact: boolean;
    read: boolean;
  };
}

// Sample data
const sampleContacts: ChatContact[] = [
  {
    id: "1",
    name: "Emma",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    lastActive: "2 hours ago",
    lastMessage: {
      text: "That sounds great! When are you free?",
      timestamp: "10:32 AM",
      isFromContact: true,
      read: false
    }
  },
  {
    id: "3",
    name: "Sophia",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80",
    lastActive: "5 mins ago",
    lastMessage: {
      text: "I love that coffee shop too! We should definitely meet there next time.",
      timestamp: "Yesterday",
      isFromContact: true,
      read: false
    }
  },
  {
    id: "5",
    name: "Olivia",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80",
    lastActive: "1 day ago",
    lastMessage: {
      text: "Thanks for the restaurant recommendation!",
      timestamp: "2 days ago",
      isFromContact: false,
      read: true
    }
  }
];

const sampleMessages: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "m1",
      senderId: "currentUser",
      text: "Hi Emma! I noticed we both enjoy hiking. Any favorite trails?",
      timestamp: "Yesterday, 4:30 PM",
      read: true
    },
    {
      id: "m2",
      senderId: "1",
      text: "Hey there! Yes, I love the trails at Mountain Creek Park. Have you been there?",
      timestamp: "Yesterday, 5:15 PM",
      read: true
    },
    {
      id: "m3",
      senderId: "currentUser",
      text: "I haven't, but I've heard great things! Would you like to check it out together sometime?",
      timestamp: "Yesterday, 6:22 PM",
      read: true
    },
    {
      id: "m4",
      senderId: "1",
      text: "That sounds great! When are you free?",
      timestamp: "Today, 10:32 AM",
      read: false
    }
  ],
  "3": [
    {
      id: "m1",
      senderId: "currentUser",
      text: "Hi Sophia! I saw that you've been to Japan. I'm planning a trip there next year. Any recommendations?",
      timestamp: "2 days ago, 3:45 PM",
      read: true
    },
    {
      id: "m2",
      senderId: "3",
      text: "Hi! Japan is amazing. You have to visit Kyoto for the temples and Tokyo for the city vibes. And the food is incredible everywhere!",
      timestamp: "2 days ago, 5:30 PM",
      read: true
    },
    {
      id: "m3",
      senderId: "currentUser",
      text: "Thanks for the tips! I'm definitely adding those to my list. Also, would you like to grab coffee sometime? There's a great place near downtown.",
      timestamp: "Yesterday, 11:20 AM",
      read: true
    },
    {
      id: "m4",
      senderId: "3",
      text: "I love that coffee shop too! We should definitely meet there next time.",
      timestamp: "Yesterday, 4:15 PM",
      read: false
    }
  ],
  "5": [
    {
      id: "m1",
      senderId: "5",
      text: "Hey, I noticed we both love art films. Have you seen the new exhibit at the Modern Art Museum?",
      timestamp: "3 days ago, 2:10 PM",
      read: true
    },
    {
      id: "m2",
      senderId: "currentUser",
      text: "I haven't yet, but it's on my list! Would you be interested in going together?",
      timestamp: "3 days ago, 3:45 PM",
      read: true
    },
    {
      id: "m3",
      senderId: "5",
      text: "That would be great! How about next Saturday?",
      timestamp: "3 days ago, 5:30 PM",
      read: true
    },
    {
      id: "m4",
      senderId: "currentUser",
      text: "Saturday works for me. By the way, there's a great restaurant nearby if you're hungry after.",
      timestamp: "2 days ago, 10:15 AM",
      read: true
    },
    {
      id: "m5",
      senderId: "currentUser",
      text: "Thanks for the restaurant recommendation!",
      timestamp: "2 days ago, 3:20 PM",
      read: true
    }
  ]
};

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [conversations, setConversations] = useState(sampleMessages);
  
  const handleContactSelect = (contact: ChatContact) => {
    setSelectedContact(contact);
  };
  
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;
    
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "currentUser",
      text: messageInput,
      timestamp: "Just now",
      read: true
    };
    
    setConversations(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));
    
    setMessageInput("");
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-24">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>
      
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        {/* Mobile view (tabs) */}
        <div className="md:hidden">
          <Tabs defaultValue="contacts">
            <TabsList className="w-full">
              <TabsTrigger value="contacts" className="flex-1">Contacts</TabsTrigger>
              <TabsTrigger value="chat" className="flex-1" disabled={!selectedContact}>
                {selectedContact ? selectedContact.name : "Chat"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contacts" className="p-0">
              <div className="divide-y">
                {sampleContacts.map(contact => (
                  <div
                    key={contact.id}
                    className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors
                               ${selectedContact?.id === contact.id ? 'bg-muted/50' : ''}`}
                    onClick={() => handleContactSelect(contact)}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={contact.imageUrl}
                        alt={contact.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      {contact.lastMessage?.isFromContact && !contact.lastMessage?.read && (
                        <div className="absolute -top-1 -right-1 bg-love-500 rounded-full h-3 w-3" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold truncate">{contact.name}</h3>
                        {contact.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {contact.lastMessage.timestamp}
                          </span>
                        )}
                      </div>
                      
                      {contact.lastMessage && (
                        <p className={`text-sm truncate ${contact.lastMessage.isFromContact && !contact.lastMessage.read ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                          {contact.lastMessage.isFromContact ? '' : 'You: '}
                          {contact.lastMessage.text}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="chat" className="p-0 h-[500px] flex flex-col">
              {selectedContact && (
                <>
                  <div className="p-3 border-b flex items-center gap-3">
                    <img
                      src={selectedContact.imageUrl}
                      alt={selectedContact.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{selectedContact.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedContact.lastActive}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversations[selectedContact.id]?.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.senderId === 'currentUser'
                              ? 'bg-love-500 text-white'
                              : 'bg-muted'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === 'currentUser' ? 'text-white/70' : 'text-muted-foreground'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Desktop view (side by side) */}
        <div className="hidden md:grid md:grid-cols-3 min-h-[600px]">
          <div className="border-r col-span-1 divide-y max-h-[600px] overflow-y-auto">
            {sampleContacts.map(contact => (
              <div
                key={contact.id}
                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors
                           ${selectedContact?.id === contact.id ? 'bg-muted/50' : ''}`}
                onClick={() => handleContactSelect(contact)}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={contact.imageUrl}
                    alt={contact.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  {contact.lastMessage?.isFromContact && !contact.lastMessage?.read && (
                    <div className="absolute -top-1 -right-1 bg-love-500 rounded-full h-3 w-3" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold truncate">{contact.name}</h3>
                    {contact.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {contact.lastMessage.timestamp}
                      </span>
                    )}
                  </div>
                  
                  {contact.lastMessage && (
                    <p className={`text-sm truncate ${contact.lastMessage.isFromContact && !contact.lastMessage.read ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {contact.lastMessage.isFromContact ? '' : 'You: '}
                      {contact.lastMessage.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="col-span-2 flex flex-col">
            {selectedContact ? (
              <>
                <div className="p-3 border-b flex items-center gap-3">
                  <img
                    src={selectedContact.imageUrl}
                    alt={selectedContact.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{selectedContact.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedContact.lastActive}
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversations[selectedContact.id]?.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.senderId === 'currentUser'
                            ? 'bg-love-500 text-white'
                            : 'bg-muted'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === 'currentUser' ? 'text-white/70' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t mt-auto">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-love-300 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 19.5h-5" />
                      <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <path d="M9.1 9A1 1 0 1 1 8 8a1 1 0 0 1 1.1 1" />
                      <path d="M16 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                      <path d="M9.1 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                      <path d="M16 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                      <path d="M8 13h8" />
                      <path d="M16 17v.01" />
                      <path d="M8 17v.01" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg">No conversation selected</h3>
                  <p className="text-muted-foreground mt-1">
                    Choose a contact to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
