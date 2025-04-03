
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, DollarSign, TrendingUp, Users } from "lucide-react";

interface CreatorEarningsProps {
  creatorId: string;
}

const CreatorEarnings = ({ creatorId }: CreatorEarningsProps) => {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");
  
  // Simulated earnings data - in a real app, this would come from an API
  const earningsData = {
    weekly: { amount: 127.50, subscribers: 12, goal: 500, progress: 25 },
    monthly: { amount: 540.25, subscribers: 45, goal: 1000, progress: 54 },
    yearly: { amount: 6240.75, subscribers: 52, goal: 10000, progress: 62 },
  };
  
  const data = earningsData[period];
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <DollarSign className="h-5 w-5 mr-1 text-emerald-500" />
          Subscription Earnings
        </CardTitle>
        <CardDescription>
          Track your subscriber revenue and growth
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" value={period} onValueChange={(value) => setPeriod(value as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          
          <TabsContent value={period} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="text-muted-foreground text-xs mb-1">Total Earnings</div>
                <div className="text-2xl font-bold">${data.amount.toFixed(2)}</div>
                <div className="flex items-center text-xs text-emerald-500 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+5.2% from last {period.slice(0, -2)}</span>
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="text-muted-foreground text-xs mb-1">Subscribers</div>
                <div className="text-2xl font-bold">{data.subscribers}</div>
                <div className="flex items-center text-xs text-emerald-500 mt-1">
                  <Users className="h-3 w-3 mr-1" />
                  <span>+3 new this {period.slice(0, -2)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Earnings Goal</span>
                <span className="font-medium">${data.amount.toFixed(2)} / ${data.goal}</span>
              </div>
              <Progress value={data.progress} className="h-2" />
            </div>
            
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  View Detailed Analytics
                </a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CreatorEarnings;
