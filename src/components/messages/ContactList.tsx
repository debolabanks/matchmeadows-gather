
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ChatContact } from "@/types/message";

interface ContactListProps {
  contacts: ChatContact[];
  selectedContact: ChatContact | null;
  onSelectContact: (contact: ChatContact) => void;
}

const ContactList = ({ contacts, selectedContact, onSelectContact }: ContactListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
              onClick={() => onSelectContact(contact)}
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
  );
};

export default ContactList;
