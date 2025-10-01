import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from 'next-themes';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isPremium, setIsPremium] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleGetPremium = () => {
    setIsPremium(true);
    toast.success('🎉 Премиум активирован!');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Настройки</h1>
            <p className="text-sm text-muted-foreground">Управление параметрами MetiorGPT</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">
              <Icon name="Settings" size={18} className="mr-2" />
              Общие
            </TabsTrigger>
            <TabsTrigger value="premium">
              <Icon name="Crown" size={18} className="mr-2" />
              Премиум
            </TabsTrigger>
            <TabsTrigger value="account">
              <Icon name="User" size={18} className="mr-2" />
              Аккаунт
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Внешний вид</CardTitle>
                <CardDescription>Настройте тему оформления</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Тёмная тема</Label>
                    <p className="text-sm text-muted-foreground">Переключение между светлой и тёмной темой</p>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Интерфейс</CardTitle>
                <CardDescription>Настройте поведение приложения</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Звуковые уведомления</Label>
                    <p className="text-sm text-muted-foreground">Воспроизводить звуки при новых сообщениях</p>
                  </div>
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Автосохранение</Label>
                    <p className="text-sm text-muted-foreground">Автоматически сохранять историю чатов</p>
                  </div>
                  <Switch
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Модель AI</CardTitle>
                <CardDescription>Выберите модель для генерации ответов</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between h-auto py-3">
                  <div className="text-left">
                    <p className="font-medium">MetiorGPT-4 Turbo</p>
                    <p className="text-xs text-muted-foreground">Быстрая и точная модель</p>
                  </div>
                  <Badge variant="secondary">Активна</Badge>
                </Button>
                <Button variant="outline" className="w-full justify-between h-auto py-3" disabled={!isPremium}>
                  <div className="text-left">
                    <p className="font-medium">MetiorGPT-4 Pro</p>
                    <p className="text-xs text-muted-foreground">Максимальная производительность</p>
                  </div>
                  <Badge variant="outline">
                    <Icon name="Crown" size={12} className="mr-1" />
                    Премиум
                  </Badge>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="premium" className="space-y-4 mt-6">
            <Card className="border-primary">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <Icon name="Crown" size={40} className="text-white" />
                </div>
                <CardTitle className="text-3xl">MetiorGPT Premium</CardTitle>
                <CardDescription className="text-base">
                  Получите доступ ко всем возможностям
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isPremium ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Без ограничений</p>
                          <p className="text-sm text-muted-foreground">Безлимитное количество сообщений</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Продвинутые модели</p>
                          <p className="text-sm text-muted-foreground">Доступ к MetiorGPT-4 Pro</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Приоритет</p>
                          <p className="text-sm text-muted-foreground">Быстрые ответы даже в пиковые часы</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Расширенная история</p>
                          <p className="text-sm text-muted-foreground">Неограниченное хранение чатов</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">API доступ</p>
                          <p className="text-sm text-muted-foreground">Интеграция с вашими приложениями</p>
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleGetPremium} className="w-full" size="lg">
                      <Icon name="Sparkles" size={20} className="mr-2" />
                      Активировать Premium
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Первый месяц бесплатно, затем 999₽/месяц
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Badge variant="default" className="text-lg px-4 py-2 mb-4">
                      <Icon name="Check" size={20} className="mr-2" />
                      Premium активен
                    </Badge>
                    <p className="text-muted-foreground">Вы используете все возможности MetiorGPT</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Информация о профиле</CardTitle>
                <CardDescription>Управление данными аккаунта</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Icon name="User" size={32} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Пользователь</p>
                    <p className="text-sm text-muted-foreground">user@example.com</p>
                  </div>
                </div>
                <Separator />
                <Button variant="outline" className="w-full">
                  <Icon name="Edit" size={18} className="mr-2" />
                  Редактировать профиль
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Статистика использования</CardTitle>
                <CardDescription>Ваша активность в MetiorGPT</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-accent text-center">
                  <p className="text-3xl font-bold text-primary">127</p>
                  <p className="text-sm text-muted-foreground">Чатов</p>
                </div>
                <div className="p-4 rounded-lg bg-accent text-center">
                  <p className="text-3xl font-bold text-secondary">1,429</p>
                  <p className="text-sm text-muted-foreground">Сообщений</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Опасная зона</CardTitle>
                <CardDescription>Необратимые действия с аккаунтом</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => {
                  localStorage.clear();
                  toast.success('История чатов очищена');
                  navigate('/');
                }}>
                  <Icon name="Trash2" size={18} className="mr-2" />
                  Очистить историю чатов
                </Button>
                <Button variant="destructive" className="w-full" onClick={() => {
                  localStorage.clear();
                  toast.success('Аккаунт удалён');
                  navigate('/login');
                }}>
                  <Icon name="UserX" size={18} className="mr-2" />
                  Удалить аккаунт
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
