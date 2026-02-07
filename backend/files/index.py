import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    '''API для управления HTML файлами с авторизацией'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            cur.execute('SELECT id, filename, content, created_at, updated_at FROM html_files ORDER BY created_at DESC')
            files = cur.fetchall()
            
            result = []
            for file in files:
                result.append({
                    'id': file['id'],
                    'filename': file['filename'],
                    'content': file['content'],
                    'created_at': file['created_at'].isoformat() if file['created_at'] else None,
                    'updated_at': file['updated_at'].isoformat() if file['updated_at'] else None
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'files': result})
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            password = body.get('password', '')
            
            if password != 'stepan12':
                cur.close()
                conn.close()
                return {
                    'statusCode': 403,
                    'headers': headers,
                    'body': json.dumps({'error': 'Неверный пароль'})
                }
            
            filename = body.get('filename', 'untitled.html')
            content = body.get('content', '')
            
            cur.execute(
                'INSERT INTO html_files (filename, content) VALUES (%s, %s) RETURNING id',
                (filename, content)
            )
            file_id = cur.fetchone()['id']
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({'id': file_id, 'message': 'Файл успешно создан'})
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            password = body.get('password', '')
            
            if password != 'stepan12':
                cur.close()
                conn.close()
                return {
                    'statusCode': 403,
                    'headers': headers,
                    'body': json.dumps({'error': 'Неверный пароль'})
                }
            
            file_id = body.get('id')
            filename = body.get('filename')
            content = body.get('content')
            
            if not file_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'ID файла обязателен'})
                }
            
            cur.execute(
                'UPDATE html_files SET filename = %s, content = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s',
                (filename, content, file_id)
            )
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'Файл успешно обновлён'})
            }
        
        elif method == 'DELETE':
            body = json.loads(event.get('body', '{}'))
            password = body.get('password', '')
            
            if password != 'stepan12':
                cur.close()
                conn.close()
                return {
                    'statusCode': 403,
                    'headers': headers,
                    'body': json.dumps({'error': 'Неверный пароль'})
                }
            
            file_id = body.get('id')
            
            if not file_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'ID файла обязателен'})
                }
            
            cur.execute('DELETE FROM html_files WHERE id = %s', (file_id,))
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'Файл успешно удалён'})
            }
        
        else:
            cur.close()
            conn.close()
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({'error': 'Метод не поддерживается'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
