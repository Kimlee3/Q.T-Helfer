import { neon } from '@neondatabase/serverless';
import { createHash, randomUUID } from 'crypto';

let memoryPosts = [];

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
      await sql`alter table qt_posts add column if not exists edit_token_hash text`;
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

function getStorageStatus() {
  const configured = Boolean(getDatabaseUrl());
  const memoryWritable = process.env.ALLOW_MEMORY_POSTS === 'true' || process.env.NODE_ENV !== 'production';
  return {
    configured,
    durable: configured,
    provider: configured ? 'postgres' : 'memory',
    writable: configured || memoryWritable,
    moderation: 'owner-token',
    label: configured ? '영구 저장 연결됨' : '임시 저장 모드',
    message: configured
      ? '나눔실 게시글은 서버 데이터베이스에 저장됩니다.'
      : memoryWritable
        ? '개발/테스트 모드라 임시 저장을 허용합니다. 서버가 재시작되면 사라질 수 있습니다.'
        : '영구 저장소가 아직 연결되지 않아 새 글 저장을 잠시 막아두었습니다.',
  };
}

function toApiPost(row) {
  return {
    _id: row.id,
    title: row.title,
    content: row.content,
    author: row.author,
    category: row.category || 'meditation',
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
  };
}

function toMemoryPost(post) {
  const { _editTokenHash, ...publicPost } = post;
  return publicPost;
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Edit-Token, Authorization');
}

function rejectWriteWithoutDurableStore(res) {
  const status = getStorageStatus();
  if (status.durable || status.writable) return false;

  res.status(503).json({
    message: '게시판 영구 저장소가 아직 연결되지 않았습니다.',
    storage: status,
  });
  return true;
}

function hashToken(token) {
  return createHash('sha256').update(String(token || '')).digest('hex');
}

function createEditToken() {
  return randomUUID();
}

function getHeader(req, name) {
  const value = req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function getEditToken(req, body = {}) {
  return getHeader(req, 'x-edit-token') || body.editToken || '';
}

function isAdminRequest(req) {
  const adminToken = process.env.QT_BOARD_ADMIN_TOKEN;
  if (!adminToken) return false;

  const authorization = getHeader(req, 'authorization') || '';
  const bearer = authorization.replace(/^Bearer\s+/i, '').trim();
  const headerToken = getHeader(req, 'x-admin-token') || '';
  return bearer === adminToken || headerToken === adminToken;
}

function rejectMissingEditToken(res) {
  res.status(403).json({
    message: '이 글을 수정하거나 삭제할 권한을 확인할 수 없습니다.',
  });
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const id = getIdFromUrl(req);
  const url = new URL(req.url || '/api/posts', 'https://qt-helper.local');

  if (req.method === 'GET' && url.searchParams.get('status') === '1') {
    const status = getStorageStatus();

    if (!status.configured) {
      return res.status(200).json(status);
    }

    return withStore(
      async () => res.status(200).json(status),
      () => res.status(200).json({
        ...status,
        durable: false,
        provider: 'memory',
        label: '임시 저장 모드',
        message: '데이터베이스 연결에 실패해 임시 저장으로 전환되었습니다.',
      })
    );
  }

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
          return res.status(200).json(toMemoryPost(post));
        }
        return res.status(200).json(memoryPosts.map(toMemoryPost));
      }
    );
  }

  if (req.method === 'POST') {
    if (rejectWriteWithoutDurableStore(res)) return;

    try {
      const { title, content, author, category } = await getBody(req);
      if (!title || !content || !author) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const editToken = createEditToken();
      const newPost = {
        _id: randomUUID(),
        title: String(title).trim(),
        content: String(content).trim(),
        author: String(author).trim(),
        category: ['meditation', 'completion'].includes(category) ? category : 'meditation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _editTokenHash: hashToken(editToken),
      };

      return withStore(
        async (sql) => {
          const rows = await sql`
            insert into qt_posts (id, title, content, author, category, edit_token_hash)
            values (${newPost._id}, ${newPost.title}, ${newPost.content}, ${newPost.author}, ${newPost.category}, ${newPost._editTokenHash})
            returning *
          `;
          return res.status(201).json({ ...toApiPost(rows[0]), editToken });
        },
        () => {
          memoryPosts = [newPost, ...memoryPosts];
          return res.status(201).json({ ...toMemoryPost(newPost), editToken });
        }
      );
    } catch (error) {
      return res.status(400).json({ message: 'Invalid request body', details: error.message });
    }
  }

  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ message: 'Post ID is required' });
    if (rejectWriteWithoutDurableStore(res)) return;

    try {
      const body = await getBody(req);
      const { title, content, author, category } = body;
      if (!title || !content || !author) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      const token = getEditToken(req, body);
      const admin = isAdminRequest(req);
      if (!admin && !token) return rejectMissingEditToken(res);
      const tokenHash = hashToken(token);

      return withStore(
        async (sql) => {
          const rows = admin
            ? await sql`
                update qt_posts
                set title = ${String(title).trim()},
                    content = ${String(content).trim()},
                    author = ${String(author).trim()},
                    category = ${['meditation', 'completion'].includes(category) ? category : 'meditation'},
                    updated_at = now()
                where id = ${id}
                returning *
              `
            : await sql`
                update qt_posts
                set title = ${String(title).trim()},
                    content = ${String(content).trim()},
                    author = ${String(author).trim()},
                    category = ${['meditation', 'completion'].includes(category) ? category : 'meditation'},
                    updated_at = now()
                where id = ${id} and edit_token_hash = ${tokenHash}
                returning *
              `;
          if (!rows[0]) return rejectMissingEditToken(res);
          return res.status(200).json(toApiPost(rows[0]));
        },
        () => {
          const index = memoryPosts.findIndex((item) => item._id === id);
          if (index === -1) return res.status(404).json({ message: 'Post not found' });
          if (!admin && memoryPosts[index]._editTokenHash !== tokenHash) return rejectMissingEditToken(res);
          memoryPosts[index] = {
            ...memoryPosts[index],
            title: String(title).trim(),
            content: String(content).trim(),
            author: String(author).trim(),
            category: ['meditation', 'completion'].includes(category) ? category : 'meditation',
            updatedAt: new Date().toISOString(),
          };
          return res.status(200).json(toMemoryPost(memoryPosts[index]));
        }
      );
    } catch (error) {
      return res.status(400).json({ message: 'Invalid request body', details: error.message });
    }
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ message: 'Post ID is required' });
    if (rejectWriteWithoutDurableStore(res)) return;
    const token = getEditToken(req);
    const admin = isAdminRequest(req);
    if (!admin && !token) return rejectMissingEditToken(res);
    const tokenHash = hashToken(token);

    return withStore(
      async (sql) => {
        const rows = admin
          ? await sql`delete from qt_posts where id = ${id} returning *`
          : await sql`delete from qt_posts where id = ${id} and edit_token_hash = ${tokenHash} returning *`;
        if (!rows[0]) return rejectMissingEditToken(res);
        return res.status(200).json({ message: 'Post deleted successfully', deletedPost: toApiPost(rows[0]) });
      },
      () => {
        const post = memoryPosts.find((item) => item._id === id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (!admin && post._editTokenHash !== tokenHash) return rejectMissingEditToken(res);
        memoryPosts = memoryPosts.filter((item) => item._id !== id);
        return res.status(200).json({ message: 'Post deleted successfully', deletedPost: toMemoryPost(post) });
      }
    );
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
