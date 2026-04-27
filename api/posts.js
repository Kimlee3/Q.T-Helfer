import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'crypto';

let memoryPosts = [
  {
    _id: '1',
    title: '첫 번째 게시글',
    content: '안녕하세요! 첫 번째 게시글입니다.',
    author: '관리자',
    category: 'meditation',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'QT 헬퍼 사용법',
    content: 'QT 헬퍼를 사용하여 매일 말씀을 읽어보세요.',
    author: '관리자',
    category: 'completion',
    createdAt: new Date().toISOString(),
  },
];

let dbReady = false;
let dbInitPromise = null;

function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.NEON_DATABASE_URL ||
    ''
  );
}

function getSql() {
  const databaseUrl = getDatabaseUrl();
  return databaseUrl ? neon(databaseUrl) : null;
}

async function ensureSchema(sql) {
  if (dbReady) return;
  if (!dbInitPromise) {
    dbInitPromise = sql`
      create table if not exists qt_posts (
        id text primary key,
        title text not null,
        content text not null,
        author text not null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `;
    dbInitPromise = dbInitPromise.then(async () => {
      await sql`alter table qt_posts add column if not exists category text not null default 'meditation'`;
      dbReady = true;
    });
  }
  await dbInitPromise;
}

async function getBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

  return await new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function getIdFromUrl(req) {
  const url = new URL(req.url || '/api/posts', 'https://qt-helper.local');
  const queryId = url.searchParams.get('id');
  if (queryId) return queryId;

  const parts = url.pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1];
  return last && last !== 'posts' && last !== 'posts.js' ? decodeURIComponent(last) : null;
}

function toApiPost(row) {
  return {
    _id: row.id,
    title: row.title,
    content: row.content,
    author: row.author,
    category: row.category || 'meditation',
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  };
}

async function withStore(callback, fallback) {
  const sql = getSql();
  if (!sql) return fallback();

  try {
    await ensureSchema(sql);
    return await callback(sql);
  } catch (error) {
    console.error('Postgres storage failed, using memory fallback:', error);
    return fallback(error);
  }
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const id = getIdFromUrl(req);

  if (req.method === 'GET') {
    return withStore(
      async (sql) => {
        if (id) {
          const rows = await sql`select * from qt_posts where id = ${id} limit 1`;
          if (!rows[0]) return res.status(404).json({ message: 'Post not found' });
          return res.status(200).json(toApiPost(rows[0]));
        }

        const rows = await sql`select * from qt_posts order by created_at desc`;
        return res.status(200).json(rows.map(toApiPost));
      },
      () => {
        if (id) {
          const post = memoryPosts.find((item) => item._id === id);
          if (!post) return res.status(404).json({ message: 'Post not found' });
          return res.status(200).json(post);
        }
        return res.status(200).json(memoryPosts);
      }
    );
  }

  if (req.method === 'POST') {
    try {
      const { title, content, author, category } = await getBody(req);
      if (!title || !content || !author) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const newPost = {
        _id: randomUUID(),
        title: String(title).trim(),
        content: String(content).trim(),
        author: String(author).trim(),
        category: ['meditation', 'completion'].includes(category) ? category : 'meditation',
        createdAt: new Date().toISOString(),
      };

      return withStore(
        async (sql) => {
          const rows = await sql`
            insert into qt_posts (id, title, content, author, category)
            values (${newPost._id}, ${newPost.title}, ${newPost.content}, ${newPost.author}, ${newPost.category})
            returning *
          `;
          return res.status(201).json(toApiPost(rows[0]));
        },
        () => {
          memoryPosts = [newPost, ...memoryPosts];
          return res.status(201).json(newPost);
        }
      );
    } catch (error) {
      return res.status(400).json({ message: 'Invalid request body', details: error.message });
    }
  }

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ message: 'Post ID is required' });

    try {
      const { title, content, author, category } = await getBody(req);
      if (!title || !content || !author) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      return withStore(
        async (sql) => {
          const rows = await sql`
            update qt_posts
            set title = ${String(title).trim()},
                content = ${String(content).trim()},
                author = ${String(author).trim()},
                category = ${['meditation', 'completion'].includes(category) ? category : 'meditation'},
                updated_at = now()
            where id = ${id}
            returning *
          `;
          if (!rows[0]) return res.status(404).json({ message: 'Post not found' });
          return res.status(200).json(toApiPost(rows[0]));
        },
        () => {
          const index = memoryPosts.findIndex((item) => item._id === id);
          if (index === -1) return res.status(404).json({ message: 'Post not found' });
          memoryPosts[index] = {
            ...memoryPosts[index],
            title: String(title).trim(),
            content: String(content).trim(),
            author: String(author).trim(),
            category: ['meditation', 'completion'].includes(category) ? category : 'meditation',
          };
          return res.status(200).json(memoryPosts[index]);
        }
      );
    } catch (error) {
      return res.status(400).json({ message: 'Invalid request body', details: error.message });
    }
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ message: 'Post ID is required' });

    return withStore(
      async (sql) => {
        const rows = await sql`delete from qt_posts where id = ${id} returning *`;
        if (!rows[0]) return res.status(404).json({ message: 'Post not found' });
        return res.status(200).json({ message: 'Post deleted successfully', deletedPost: toApiPost(rows[0]) });
      },
      () => {
        const post = memoryPosts.find((item) => item._id === id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        memoryPosts = memoryPosts.filter((item) => item._id !== id);
        return res.status(200).json({ message: 'Post deleted successfully', deletedPost: post });
      }
    );
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
