
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Send, Check, CheckCheck, Globe } from "lucide-react";
import { ChatMessage, ChatContact, MessageReaction, MessageAttachment } from "@/types/message";
import MessageAttachmentComponent from "@/components/MessageAttachment";
import MessageReactions from "@/components/MessageReactions";
import AttachmentUploader from "@/components/AttachmentUploader";
import LanguageSelector from "@/components/LanguageSelector";
import { SupportedLanguage } from "@/components/LanguageSelector";
import { useToast } from "@/hooks/use-toast";

// Sample data
const sampleContacts: ChatContact[] = [
  {
    id: "1",
    name: "Emma",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    lastActive: "2 hours ago",
    isOnline: true,
    preferredLanguage: "en",
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
    isOnline: true,
    preferredLanguage: "fr",
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
    isOnline: false,
    preferredLanguage: "es",
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
      read: true,
      reactions: [
        { userId: "currentUser", emoji: "👍", timestamp: "Yesterday, 5:16 PM" }
      ]
    },
    {
      id: "m3",
      senderId: "currentUser",
      text: "I haven't, but I've heard great things! Would you like to check it out together sometime?",
      timestamp: "Yesterday, 6:22 PM",
      read: true,
      isEncrypted: true
    },
    {
      id: "m4",
      senderId: "1",
      text: "That sounds great! When are you free?",
      timestamp: "Today, 10:32 AM",
      read: false,
      attachments: [
        {
          id: "a1",
          type: "image",
          url: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400",
          name: "mountain_trail.jpg"
        }
      ]
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
      read: true,
      language: "fr",
      translation: {
        text: "Salut! Le Japon est incroyable. Tu dois visiter Kyoto pour les temples et Tokyo pour l'ambiance urbaine. Et la nourriture est incroyable partout!",
        language: "fr"
      }
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
      read: false,
      reactions: [
        { userId: "currentUser", emoji: "❤️", timestamp: "Yesterday, 4:20 PM" },
        { userId: "5", emoji: "👍", timestamp: "Yesterday, 5:30 PM" }
      ]
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
      read: true,
      isVoiceMessage: true
    },
    {
      id: "m4",
      senderId: "currentUser",
      text: "Saturday works for me. By the way, there's a great restaurant nearby if you're hungry after.",
      timestamp: "2 days ago, 10:15 AM",
      read: true,
      attachments: [
        {
          id: "a1",
          type: "file",
          url: "#",
          name: "restaurant_menu.pdf"
        }
      ]
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

// Simulate content moderation
const moderateContent = (text: string): { text: string; isApproved: boolean; reason?: string } => {
  const profanityList = ["badword", "explicit", "offensive"];
  
  let isApproved = true;
  let moderatedText = text;
  let reason;
  
  // Basic profanity filter
  profanityList.forEach(word => {
    if (text.toLowerCase().includes(word)) {
      moderatedText = moderatedText.replace(new RegExp(word, 'gi'), '***');
      isApproved = false;
      reason = "Message contains inappropriate language";
    }
  });
  
  return { text: moderatedText, isApproved, reason };
};

// Mock translation API
const translateText = (text: string, targetLanguage: string): Promise<string> => {
  // In a real app, this would call a translation API
  const translations: Record<string, Record<string, string>> = {
    en: {
      fr: "Ceci est une traduction simulée en français.",
      es: "Esta es una traducción simulada al español.",
      de: "Dies ist eine simulierte Übersetzung auf Deutsch."
    },
    fr: {
      en: "This is a simulated translation in English.",
      es: "Esta es una traducción simulada al español.",
      de: "Dies ist eine simulierte Übersetzung auf Deutsch."
    },
    es: {
      en: "This is a simulated translation in English.",
      fr: "Ceci est une traduction simulée en français.",
      de: "Dies ist eine simulierte Übersetzung auf Deutsch."
    }
  };
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (translations[targetLanguage]) {
        resolve(translations[targetLanguage][targetLanguage] || `[Translation to ${targetLanguage}]`);
      } else {
        resolve(`[Translation to ${targetLanguage}]`);
      }
    }, 500);
  });
};

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [conversations, setConversations] = useState(sampleMessages);
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");
  const [showTranslation, setShowTranslation] = useState(false);
  const [messageEncryption, setMessageEncryption] = useState(false);
  const { toast } = useToast();
  
  const handleContactSelect = (contact: ChatContact) => {
    setSelectedContact(contact);
    
    // Mark messages as read
    if (contact && conversations[contact.id]) {
      const updatedMessages = conversations[contact.id].map(msg => {
        if (msg.senderId === contact.id && !msg.read) {
          return { ...msg, read: true };
        }
        return msg;
      });
      
      setConversations({
        ...conversations,
        [contact.id]: updatedMessages
      });
    }
    
    // Set preferred language if contact has one
    if (contact.preferredLanguage) {
      setSelectedLanguage(contact.preferredLanguage as SupportedLanguage);
    }
  };
  
  const handleSendMessage = () => {
    if ((!messageInput.trim() && pendingAttachments.length === 0) || !selectedContact) return;
    
    // Apply content moderation
    const moderationResult = moderateContent(messageInput);
    
    if (!moderationResult.isApproved) {
      toast({
        title: "Message not sent",
        description: moderationResult.reason,
        variant: "destructive"
      });
      return;
    }
    
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "currentUser",
      text: moderationResult.text,
      timestamp: "Just now",
      read: true,
      isEncrypted: messageEncryption,
      attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined
    };
    
    setConversations(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));
    
    setMessageInput("");
    setPendingAttachments([]);
    
    // Simulate response for demo
    setTimeout(() => {
      const autoResponse: ChatMessage = {
        id: `m${Date.now() + 1}`,
        senderId: selectedContact.id,
        text: "Thanks for your message! I'll respond soon.",
        timestamp: "Just now",
        read: false
      };
      
      setConversations(prev => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), autoResponse]
      }));
    }, 2000);
  };
  
  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!selectedContact) return;
    
    const updatedMessages = conversations[selectedContact.id].map(message => {
      if (message.id === messageId) {
        const existingReactions = message.reactions || [];
        const userAlreadyReacted = existingReactions.some(
          r => r.userId === "currentUser" && r.emoji === emoji
        );
        
        if (userAlreadyReacted) {
          // Remove reaction if already exists
          return {
            ...message,
            reactions: existingReactions.filter(
              r => !(r.userId === "currentUser" && r.emoji === emoji)
            )
          };
        } else {
          // Add reaction
          const newReaction: MessageReaction = {
            userId: "currentUser",
            emoji,
            timestamp: new Date().toISOString()
          };
          
          return {
            ...message,
            reactions: [...existingReactions, newReaction]
          };
        }
      }
      return message;
    });
    
    setConversations({
      ...conversations,
      [selectedContact.id]: updatedMessages
    });
  };
  
  const handleAttachmentUpload = (attachments: MessageAttachment[]) => {
    setPendingAttachments(attachments);
  };
  
  const getReadStatus = (message: ChatMessage) => {
    if (message.senderId !== "currentUser") return null;
    
    return message.read ? (
      <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
    ) : (
      <Check className="h-3.5 w-3.5 text-muted-foreground" />
    );
  };
  
  const toggleTranslation = async (messageId: string) => {
    if (!selectedContact) return;
    
    const updatedMessages = await Promise.all(
      conversations[selectedContact.id].map(async (message) => {
        if (message.id === messageId) {
          if (message.translation) {
            // Translation already exists, just toggle showing it
            return message;
          } else if (message.senderId !== "currentUser") {
            // Only translate messages from the contact
            const translatedText = await translateText(message.text, selectedLanguage);
            return {
              ...message,
              translation: {
                text: translatedText,
                language: selectedLanguage
              }
            };
          }
        }
        return message;
      })
    );
    
    setConversations({
      ...conversations,
      [selectedContact.id]: updatedMessages
    });
    
    setShowTranslation(!showTranslation);
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
                      {contact.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card"></div>
                      )}
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
                          {contact.lastMessage.hasAttachment && ' 📎'}
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
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{selectedContact.name}</h3>
                        {selectedContact.isOnline && (
                          <span className="text-xs font-medium text-green-500">Online</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {selectedContact.lastActive}
                      </p>
                    </div>
                    
                    <LanguageSelector 
                      value={selectedLanguage}
                      onChange={setSelectedLanguage}
                    />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedContact && conversations[selectedContact.id]?.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="max-w-[80%]">
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.senderId === 'currentUser'
                                ? 'bg-love-500 text-white'
                                : 'bg-muted'
                            }`}
                          >
                            {message.isEncrypted && (
                              <div className="flex items-center gap-1 text-xs mb-1 opacity-70">
                                <Lock className="h-3 w-3" />
                                <span>Encrypted message</span>
                              </div>
                            )}
                            
                            {message.isVoiceMessage ? (
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                  </svg>
                                </Button>
                                <div className="w-32 h-6 bg-gray-300 rounded-full overflow-hidden">
                                  <div className="h-full w-2/3 bg-gray-500 rounded-full"></div>
                                </div>
                                <span className="text-xs">0:12</span>
                              </div>
                            ) : (
                              <>
                                <p>{showTranslation && message.translation ? message.translation.text : message.text}</p>
                                
                                {message.language && message.language !== selectedLanguage && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-xs mt-1 h-6 px-2" 
                                    onClick={() => toggleTranslation(message.id)}
                                  >
                                    <Globe className="h-3 w-3 mr-1" />
                                    {showTranslation ? "Show original" : "Translate"}
                                  </Button>
                                )}
                              </>
                            )}
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <MessageAttachmentComponent 
                                    key={attachment.id} 
                                    attachment={attachment} 
                                  />
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <p className={`text-xs ${
                                message.senderId === 'currentUser' ? 'text-white/70' : 'text-muted-foreground'
                              }`}>
                                {message.timestamp}
                              </p>
                              {getReadStatus(message)}
                            </div>
                          </div>
                          
                          {message.reactions && message.reactions.length > 0 && (
                            <div className={`mt-1 ${message.senderId === 'currentUser' ? 'text-right' : 'text-left'}`}>
                              <MessageReactions 
                                reactions={message.reactions}
                                onAddReaction={(emoji) => handleAddReaction(message.id, emoji)}
                                messageId={message.id}
                                className="inline-block"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t">
                    <AttachmentUploader 
                      onAttach={handleAttachmentUpload} 
                      className="mb-2"
                    />
                    
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant={messageEncryption ? "default" : "ghost"}
                          size="icon"
                          className="h-9 w-9 rounded-full flex-shrink-0"
                          onClick={() => setMessageEncryption(!messageEncryption)}
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      </div>
                      
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
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card"></div>
                  )}
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
                      {contact.lastMessage.hasAttachment && ' 📎'}
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{selectedContact.name}</h3>
                      {selectedContact.isOnline && (
                        <span className="text-xs font-medium text-green-500">Online</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedContact.lastActive}
                    </p>
                  </div>
                  
                  <LanguageSelector 
                    value={selectedLanguage}
                    onChange={setSelectedLanguage}
                  />
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversations[selectedContact.id]?.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="max-w-[80%]">
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.senderId === 'currentUser'
                              ? 'bg-love-500 text-white'
                              : 'bg-muted'
                          }`}
                        >
                          {message.isEncrypted && (
                            <div className="flex items-center gap-1 text-xs mb-1 opacity-70">
                              <Lock className="h-3 w-3" />
                              <span>Encrypted message</span>
                            </div>
                          )}
                          
                          {message.isVoiceMessage ? (
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polygon points="5 3 19 12 5 21 5 3"/>
                                </svg>
                              </Button>
                              <div className="w-32 h-6 bg-gray-300 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-gray-500 rounded-full"></div>
                              </div>
                              <span className="text-xs">0:12</span>
                            </div>
                          ) : (
                            <>
                              <p>{showTranslation && message.translation ? message.translation.text : message.text}</p>
                              
                              {message.language && message.language !== selectedLanguage && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-xs mt-1 h-6 px-2" 
                                  onClick={() => toggleTranslation(message.id)}
                                >
                                  <Globe className="h-3 w-3 mr-1" />
                                  {showTranslation ? "Show original" : "Translate"}
                                </Button>
                              )}
                            </>
                          )}
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment) => (
                                <MessageAttachmentComponent 
                                  key={attachment.id} 
                                  attachment={attachment} 
                                />
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <p className={`text-xs ${
                              message.senderId === 'currentUser' ? 'text-white/70' : 'text-muted-foreground'
                            }`}>
                              {message.timestamp}
                            </p>
                            {getReadStatus(message)}
                          </div>
                        </div>
                        
                        {message.reactions && message.reactions.length > 0 && (
                          <div className={`mt-1 ${message.senderId === 'currentUser' ? 'text-right' : 'text-left'}`}>
                            <MessageReactions 
                              reactions={message.reactions}
                              onAddReaction={(emoji) => handleAddReaction(message.id, emoji)}
                              messageId={message.id}
                              className="inline-block"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t mt-auto">
                  <AttachmentUploader 
                    onAttach={handleAttachmentUpload} 
                    className="mb-2"
                  />
                  
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={messageEncryption ? "default" : "ghost"}
                        size="icon"
                        className="h-9 w-9 rounded-full flex-shrink-0"
                        onClick={() => setMessageEncryption(!messageEncryption)}
                      >
                        <Lock className="h-4 w-4" />
                      </Button>
                    </div>
                    
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
