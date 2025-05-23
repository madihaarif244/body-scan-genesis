
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Bot, MessageCircle, X } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { findBestResponse } from "@/utils/chatResponses";
import { toast } from "@/hooks/use-toast";

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function ChatWindow() {
  console.log("ChatWindow component rendering"); // Debug log
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! How can I help you today? Try asking about image privacy, measurement accuracy, or what this application does!",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("ChatWindow mounted"); // Debug log
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Get appropriate response based on user input
    const response = findBestResponse(input);
    
    // Add bot response with a small delay to simulate processing
    setTimeout(() => {
      const botMessage: Message = {
        text: response,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  return (
    <>
      <Button
        onClick={() => {
          console.log("Chat button clicked"); // Debug log
          setIsOpen(true);
          toast({
            title: "Chat opened",
            description: "Ask questions about our app!",
          });
        }}
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 z-50 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        variant="default"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-[90vw] sm:w-[440px] p-0 z-[100]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <h2 className="font-semibold">3DBodyFit Assistant</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary/90"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div ref={scrollAreaRef}>
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={index} 
                    text={message.text}
                    isBot={message.isBot}
                    timestamp={message.timestamp}
                  />
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90">Send</Button>
              </form>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
