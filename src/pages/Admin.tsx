import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://functions.poehali.dev/4d3437d0-0e83-4951-821f-c05fdf45f7cb';

interface HtmlFile {
  id: number;
  filename: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [files, setFiles] = useState<HtmlFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<HtmlFile | null>(null);
  const [newFilename, setNewFilename] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === 'stepan12') {
      setIsAuthenticated(true);
      toast.success('Вход выполнен успешно!');
      loadFiles();
    } else {
      toast.error('Неверный пароль');
    }
  };

  const loadFiles = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      toast.error('Ошибка загрузки файлов');
    }
  };

  const handleCreateFile = async () => {
    if (!newFilename || !newContent) {
      toast.error('Заполните все поля');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: 'stepan12',
          filename: newFilename,
          content: newContent,
        }),
      });

      if (response.ok) {
        toast.success('Файл создан!');
        setNewFilename('');
        setNewContent('');
        loadFiles();
      } else {
        toast.error('Ошибка создания файла');
      }
    } catch (error) {
      toast.error('Ошибка сети');
    }
  };

  const handleUpdateFile = async () => {
    if (!selectedFile) return;

    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: 'stepan12',
          id: selectedFile.id,
          filename: selectedFile.filename,
          content: selectedFile.content,
        }),
      });

      if (response.ok) {
        toast.success('Файл обновлён!');
        setIsEditing(false);
        setSelectedFile(null);
        loadFiles();
      } else {
        toast.error('Ошибка обновления файла');
      }
    } catch (error) {
      toast.error('Ошибка сети');
    }
  };

  const handleDeleteFile = async (id: number) => {
    if (!confirm('Удалить файл?')) return;

    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: 'stepan12',
          id,
        }),
      });

      if (response.ok) {
        toast.success('Файл удалён!');
        loadFiles();
      } else {
        toast.error('Ошибка удаления файла');
      }
    } catch (error) {
      toast.error('Ошибка сети');
    }
  };

  const handleEditFile = (file: HtmlFile) => {
    setSelectedFile(file);
    setIsEditing(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4">
              <Icon name="Lock" className="text-white" size={32} />
            </div>
            <CardTitle className="text-3xl">Админ-панель</CardTitle>
            <CardDescription>Введите пароль для доступа</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Icon name="LogIn" size={20} className="mr-2" />
              Войти
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              Назад на главную
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-purple-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Icon name="Shield" className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Админ-панель
              </h1>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/')} variant="outline">
                <Icon name="Home" size={20} className="mr-2" />
                На главную
              </Button>
              <Button
                onClick={() => setIsAuthenticated(false)}
                variant="destructive"
              >
                <Icon name="LogOut" size={20} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Create New File */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="FilePlus" size={24} className="text-purple-600" />
              Создать новый файл
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Имя файла</label>
              <Input
                placeholder="example.html"
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">HTML код</label>
              <Textarea
                placeholder="<!DOCTYPE html>..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="font-mono min-h-[200px]"
              />
            </div>
            <Button
              onClick={handleCreateFile}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Создать файл
            </Button>
          </CardContent>
        </Card>

        {/* Edit File Modal */}
        {isEditing && selectedFile && (
          <Card className="shadow-xl border-2 border-purple-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Edit" size={24} className="text-purple-600" />
                Редактировать файл
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Имя файла</label>
                <Input
                  value={selectedFile.filename}
                  onChange={(e) =>
                    setSelectedFile({ ...selectedFile, filename: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">HTML код</label>
                <Textarea
                  value={selectedFile.content}
                  onChange={(e) =>
                    setSelectedFile({ ...selectedFile, content: e.target.value })
                  }
                  className="font-mono min-h-[300px]"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdateFile}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Icon name="Save" size={20} className="mr-2" />
                  Сохранить изменения
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedFile(null);
                  }}
                  variant="outline"
                >
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Files List */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Files" size={24} className="text-purple-600" />
              Список файлов ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Файлов пока нет</p>
            ) : (
              <div className="space-y-4">
                {files.map((file) => (
                  <Card key={file.id} className="border-purple-100">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{file.filename}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            ID: {file.id} | Создан:{' '}
                            {new Date(file.created_at).toLocaleString('ru-RU')}
                          </p>
                          <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-32">
                            {file.content.substring(0, 200)}
                            {file.content.length > 200 && '...'}
                          </pre>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditFile(file)}
                          >
                            <Icon name="Edit" size={16} className="mr-1" />
                            Изменить
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <Icon name="Trash2" size={16} className="mr-1" />
                            Удалить
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
