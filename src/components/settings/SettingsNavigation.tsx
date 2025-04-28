
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Heart, 
  User, 
  Ban, 
  ShieldAlert, 
  Trash2, 
  ChevronRight 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SettingsNavigationProps {
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

const SettingsNavigation = ({ activeSection, onNavigate }: SettingsNavigationProps) => {
  const navigate = useNavigate();

  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    } else {
      navigate(`/settings/${section}`);
    }
  };

  const navigationItems = [
    {
      id: "notifications",
      title: "Notification Preferences",
      description: "Manage how we contact you",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      id: "dating",
      title: "Dating Preferences",
      description: "Set your distance, age range, and more",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      id: "account",
      title: "Account Information",
      description: "Update your email and password",
      icon: <User className="h-5 w-5" />,
    },
    {
      id: "blocked",
      title: "Blocked Users",
      description: "Manage users you've blocked",
      icon: <Ban className="h-5 w-5" />,
    },
    {
      id: "safety",
      title: "Safety & Support",
      description: "Get help with safety concerns",
      icon: <ShieldAlert className="h-5 w-5" />,
    },
    {
      id: "delete",
      title: "Delete Account",
      description: "Permanently delete your account and data",
      icon: <Trash2 className="h-5 w-5" />,
      className: "text-destructive",
    }
  ];

  return (
    <div className="space-y-1">
      {navigationItems.map((item, index) => (
        <React.Fragment key={item.id}>
          <div 
            className={`flex justify-between items-center py-2 group cursor-pointer hover:bg-muted/50 px-2 rounded-md transition-colors ${item.className || ''} ${activeSection === item.id ? 'bg-muted/70' : ''}`}
            onClick={() => handleNavigate(item.id)}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          {index < navigationItems.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SettingsNavigation;
