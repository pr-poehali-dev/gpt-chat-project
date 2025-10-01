import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedChats = localStorage.getItem('meteior-chats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);
      
      if (chatId) {
        const foundChat = parsedChats.find((c: Chat) => c.id === chatId);
        if (foundChat) {
          setCurrentChat(foundChat);
        }
      } else if (parsedChats.length > 0) {
        setCurrentChat(parsedChats[0]);
      }
    }
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'Новый чат',
      messages: [],
      lastUpdated: new Date()
    };
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setCurrentChat(newChat);
    localStorage.setItem('meteior-chats', JSON.stringify(updatedChats));
    navigate(`/chat/${newChat.id}`);
    setIsSidebarOpen(false);
    toast.success('Создан новый чат');
  };

  const deleteChat = (chatIdToDelete: string) => {
    const updatedChats = chats.filter(c => c.id !== chatIdToDelete);
    setChats(updatedChats);
    localStorage.setItem('meteior-chats', JSON.stringify(updatedChats));
    
    if (currentChat?.id === chatIdToDelete) {
      if (updatedChats.length > 0) {
        setCurrentChat(updatedChats[0]);
        navigate(`/chat/${updatedChats[0].id}`);
      } else {
        setCurrentChat(null);
        navigate('/');
      }
    }
    toast.success('Чат удалён');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    let updatedChat: Chat;
    
    if (!currentChat) {
      updatedChat = {
        id: Date.now().toString(),
        title: input.slice(0, 50),
        messages: [userMessage],
        lastUpdated: new Date()
      };
      setCurrentChat(updatedChat);
    } else {
      updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, userMessage],
        lastUpdated: new Date()
      };
      if (currentChat.messages.length === 0) {
        updatedChat.title = input.slice(0, 50);
      }
      setCurrentChat(updatedChat);
    }

    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Привет! Я MetiorGPT — твой AI-ассистент. Я могу помочь с программированием, написанием текстов, анализом данных и многим другим. Что тебя интересует?`,
        timestamp: new Date()
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage],
        lastUpdated: new Date()
      };

      setCurrentChat(finalChat);
      
      const updatedChats = chats.some(c => c.id === finalChat.id)
        ? chats.map(c => c.id === finalChat.id ? finalChat : c)
        : [finalChat, ...chats];
      
      setChats(updatedChats);
      localStorage.setItem('meteior-chats', JSON.stringify(updatedChats));
      setIsLoading(false);
    }, 1000);
  };

  const selectChat = (chat: Chat) => {
    setCurrentChat(chat);
    navigate(`/chat/${chat.id}`);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden lg:flex lg:flex-col lg:w-80 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MetiorGPT
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
            >
              <Icon name="Settings" size={20} />
            </Button>
          </div>
          <Button onClick={createNewChat} className="w-full" size="lg">
            <Icon name="Plus" size={20} className="mr-2" />
            Новый чат
          </Button>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-accent ${
                  currentChat?.id === chat.id ? 'bg-accent' : ''
                }`}
                onClick={() => selectChat(chat)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Icon name="MessageSquare" size={18} className="text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {chat.messages.length} сообщений
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            <Icon name="User" size={18} className="mr-2" />
            Профиль
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-border bg-card lg:hidden">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icon name="Menu" size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-border">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                    MetiorGPT
                  </h1>
                  <Button onClick={createNewChat} className="w-full" size="lg">
                    <Icon name="Plus" size={20} className="mr-2" />
                    Новый чат
                  </Button>
                </div>

                <ScrollArea className="flex-1 p-2">
                  <div className="space-y-1">
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-accent ${
                          currentChat?.id === chat.id ? 'bg-accent' : ''
                        }`}
                        onClick={() => selectChat(chat)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Icon name="MessageSquare" size={18} className="text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{chat.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {chat.messages.length} сообщений
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat.id);
                          }}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full mb-2"
                    onClick={() => {
                      navigate('/settings');
                      setIsSidebarOpen(false);
                    }}
                  >
                    <Icon name="Settings" size={18} className="mr-2" />
                    Настройки
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigate('/login');
                      setIsSidebarOpen(false);
                    }}
                  >
                    <Icon name="User" size={18} className="mr-2" />
                    Профиль
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MetiorGPT
          </h1>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
          >
            <Icon name="Settings" size={20} />
          </Button>
        </header>

        <ScrollArea className="flex-1 p-4">
          {!currentChat || currentChat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 animate-pulse-glow">
                <Icon name="Sparkles" size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Добро пожаловать в MetiorGPT</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Мощный AI-ассистент для программирования, творчества и решения задач
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => setInput('Напиши код на Python для сортировки списка')}
                >
                  <Icon name="Code" size={20} className="mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Программирование</p>
                    <p className="text-xs text-muted-foreground">Помощь с кодом</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => setInput('Объясни квантовую физику простыми словами')}
                >
                  <Icon name="BookOpen" size={20} className="mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Обучение</p>
                    <p className="text-xs text-muted-foreground">Объяснения</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => setInput('Придумай креативную идею для стартапа')}
                >
                  <Icon name="Lightbulb" size={20} className="mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Идеи</p>
                    <p className="text-xs text-muted-foreground">Мозговой штурм</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => setInput('Проанализируй данные продаж за квартал')}
                >
                  <Icon name="BarChart" size={20} className="mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Анализ</p>
                    <p className="text-xs text-muted-foreground">Работа с данными</p>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6 pb-4">
              {currentChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 animate-fade-in ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-10 h-10 border-2 border-primary">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-2xl px-6 py-4 max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="w-10 h-10 border-2 border-secondary">
                      <AvatarFallback className="bg-gradient-to-br from-secondary to-primary text-white">
                        Я
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 animate-fade-in">
                  <Avatar className="w-10 h-10 border-2 border-primary">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl px-6 py-4 bg-card border border-border">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-border bg-card p-4">
          <div className="max-w-4xl mx-auto">
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
                placeholder="Напишите сообщение..."
                className="flex-1 h-12 text-base"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="lg"
                disabled={!input.trim() || isLoading}
                className="px-6"
              >
                <Icon name="Send" size={20} />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-2">
              MetiorGPT может допускать ошибки. Проверяйте важную информацию.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
