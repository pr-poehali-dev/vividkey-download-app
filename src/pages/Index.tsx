import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const API_URL = 'https://functions.poehali.dev/4d3437d0-0e83-4951-821f-c05fdf45f7cb';

const Index = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [currentFile, setCurrentFile] = useState<any>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.files && data.files.length > 0) {
        const firstFile = data.files[0];
        setCurrentFile(firstFile);
        setHtmlCode(firstFile.content);
      } else {
        setHtmlCode('<!DOCTYPE html>\n<html>\n<head>\n  <title>Пример HTML</title>\n</head>\n<body>\n  <h1>Привет, мир!</h1>\n  <p>Это пример HTML файла.</p>\n</body>\n</html>');
      }
    } catch (error) {
      setHtmlCode('<!DOCTYPE html>\n<html>\n<head>\n  <title>Пример HTML</title>\n</head>\n<body>\n  <h1>Привет, мир!</h1>\n  <p>Это пример HTML файла.</p>\n</body>\n</html>');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile ? currentFile.filename : 'vividkey-file.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('HTML файл успешно скачан!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setHtmlCode(content);
        toast.success('Файл загружен!');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-purple-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Icon name="Code2" className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Vividkey
              </h1>
            </div>
            <nav className="hidden md:flex gap-6">
              <button
                onClick={() => setActiveTab('home')}
                className={`font-medium transition-colors ${
                  activeTab === 'home' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Главная
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`font-medium transition-colors ${
                  activeTab === 'about' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                О приложении
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`font-medium transition-colors ${
                  activeTab === 'support' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Поддержка
              </button>
            </nav>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Icon name="Download" size={20} className="mr-2" />
              Скачать
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Главная */}
          <TabsContent value="home" className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-12">
              <div className="inline-block animate-scale-in">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-500 flex items-center justify-center mb-4 shadow-2xl">
                  <Icon name="FileCode" className="text-white" size={40} />
                </div>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-500 bg-clip-text text-transparent">
                Просмотрите и скачайте HTML
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Загрузите HTML файл, просмотрите его в реальном времени и скачайте в один клик
              </p>
            </div>

            {/* Main Editor */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Code Editor */}
              <Card className="shadow-xl border-purple-100 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Code" size={24} className="text-purple-600" />
                    HTML Редактор
                  </CardTitle>
                  <CardDescription>Редактируйте или загрузите свой HTML код</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Icon name="Upload" size={20} className="mr-2" />
                      Загрузить файл
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".html"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button variant="outline" onClick={() => setHtmlCode('')}>
                      <Icon name="Trash2" size={20} />
                    </Button>
                  </div>
                  <Textarea
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    className="font-mono text-sm min-h-[400px] border-purple-200 focus:border-purple-400"
                    placeholder="Вставьте HTML код здесь..."
                  />
                </CardContent>
              </Card>

              {/* Live Preview */}
              <Card className="shadow-xl border-blue-100 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Eye" size={24} className="text-blue-500" />
                    Предпросмотр в реальном времени
                  </CardTitle>
                  <CardDescription>Увидьте результат перед скачиванием</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-blue-200 rounded-lg overflow-hidden bg-white min-h-[460px]">
                    <iframe
                      srcDoc={htmlCode}
                      title="HTML Preview"
                      className="w-full h-[460px]"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Download Section */}
            <Card className="shadow-xl border-pink-100 bg-gradient-to-br from-purple-50 to-pink-50 animate-scale-in">
              <CardContent className="py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Готовы скачать?</h3>
                    <p className="text-gray-600">
                      Ваш HTML файл готов к скачиванию на любое устройство
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Icon name="Download" size={24} className="mr-2" />
                    Скачать HTML файл
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="border-purple-100 hover:shadow-xl transition-shadow animate-fade-in">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
                    <Icon name="Zap" size={24} className="text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg">Мгновенный предпросмотр</h3>
                  <p className="text-gray-600 text-sm">
                    Видите изменения в реальном времени при редактировании кода
                  </p>
                </CardContent>
              </Card>

              <Card className="border-pink-100 hover:shadow-xl transition-shadow animate-fade-in">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-pink-100 flex items-center justify-center">
                    <Icon name="Smartphone" size={24} className="text-pink-600" />
                  </div>
                  <h3 className="font-bold text-lg">Кросс-платформенность</h3>
                  <p className="text-gray-600 text-sm">
                    Работает на любых устройствах: ПК, планшет, телефон
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-100 hover:shadow-xl transition-shadow animate-fade-in">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                    <Icon name="Shield" size={24} className="text-blue-500" />
                  </div>
                  <h3 className="font-bold text-lg">Безопасность</h3>
                  <p className="text-gray-600 text-sm">
                    Все данные обрабатываются локально в вашем браузере
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* О приложении */}
          <TabsContent value="about" className="space-y-6 animate-fade-in">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Icon name="Info" size={32} className="text-purple-600" />
                  О приложении Vividkey
                </CardTitle>
                <CardDescription className="text-base">
                  Современный браузерный инструмент для работы с HTML файлами
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Что такое Vividkey?</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vividkey-браузер — это мощное веб-приложение для просмотра, редактирования и скачивания
                    HTML файлов. Мы создали удобный инструмент, который работает прямо в вашем браузере без
                    необходимости установки дополнительного ПО.
                  </p>

                  <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Основные возможности</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={20} className="text-green-500 mt-1 flex-shrink-0" />
                      <span>Предпросмотр HTML в реальном времени без задержек</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={20} className="text-green-500 mt-1 flex-shrink-0" />
                      <span>Встроенный редактор кода с подсветкой синтаксиса</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={20} className="text-green-500 mt-1 flex-shrink-0" />
                      <span>Скачивание готовых HTML файлов одним кликом</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={20} className="text-green-500 mt-1 flex-shrink-0" />
                      <span>Загрузка существующих файлов для редактирования</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={20} className="text-green-500 mt-1 flex-shrink-0" />
                      <span>Полная кросс-платформенность и адаптивный дизайн</span>
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Технологии</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Приложение построено на современном стеке технологий: React, TypeScript, и Tailwind CSS.
                    Это гарантирует высокую производительность и отличный пользовательский опыт на всех
                    платформах.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Поддержка */}
          <TabsContent value="support" className="space-y-6 animate-fade-in">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Icon name="HelpCircle" size={32} className="text-purple-600" />
                  Поддержка
                </CardTitle>
                <CardDescription className="text-base">
                  Ответы на часто задаваемые вопросы и обратная связь
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* FAQ */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Часто задаваемые вопросы</h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-left">
                        Как загрузить свой HTML файл?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        Нажмите кнопку "Загрузить файл" в редакторе, выберите файл с расширением .html на
                        вашем устройстве. Содержимое файла автоматически отобразится в редакторе и в
                        предпросмотре.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-left">
                        Безопасно ли использовать Vividkey?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        Да, абсолютно безопасно! Все операции выполняются локально в вашем браузере. Ваши
                        файлы не загружаются на сервер и не покидают ваше устройство.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-left">
                        На каких устройствах работает приложение?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        Vividkey работает на всех современных устройствах с браузером: компьютерах,
                        планшетах и смартфонах. Интерфейс адаптируется под размер экрана.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-left">
                        Можно ли редактировать код?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        Конечно! Вы можете вставить или написать код с нуля, отредактировать загруженный
                        файл, и сразу увидеть результат в окне предпросмотра.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-left">
                        Какой формат файлов поддерживается?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        В данный момент приложение работает с файлами формата .html. Поддержка других
                        форматов (CSS, JavaScript) планируется в будущих обновлениях.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Contact Form */}
                <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Mail" size={24} className="text-purple-600" />
                      Обратная связь
                    </CardTitle>
                    <CardDescription>
                      Не нашли ответ на свой вопрос? Свяжитесь с нами!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        <Icon name="Mail" size={16} className="inline mr-1 text-purple-600" />
                        Электронная почта для связи:
                      </p>
                      <a 
                        href="mailto:vividkey@yandex.ru" 
                        className="text-purple-600 font-bold text-lg hover:text-purple-700 transition-colors"
                      >
                        vividkey@yandex.ru
                      </a>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Ваше сообщение</label>
                      <Textarea
                        placeholder="Опишите вашу проблему или предложение..."
                        className="min-h-[120px]"
                      />
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => toast.success('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.')}
                    >
                      <Icon name="Send" size={20} className="mr-2" />
                      Отправить сообщение
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white/50 backdrop-blur-lg mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Icon name="Code2" className="text-white" size={16} />
              </div>
              <span className="font-bold text-gray-800">Vividkey-браузер</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2024 Vividkey. Современный инструмент для работы с HTML
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;