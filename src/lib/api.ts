export type PlanCode = '1m' | '3m' | '6m' | '1y';

type ApiError = Error & { status?: number };

export type UserStatus = {
  tg_chat_id: number;
  tg_username: string | null;
  is_blocked: boolean;
  has_subscription: boolean;
  subscription: {
    plan: PlanCode;
    max_devices: number;
    price_paid: number;
    started_at: string;
    expires_at: string;
    days_left: number;
  } | null;
  sub_url: string;
  devices_count: number;
  devices: Array<{
    id: number;
    name: string | null;
    last_ip: string | null;
    last_seen_at: string | null;
  }>;
  referrals_count: number;
  bonus_days: number;
  purchases: Array<{
    id: number;
    plan: PlanCode;
    max_devices: number;
    price_paid: number;
    payment_id: string | null;
    created_at: string;
    started_at: string;
    expires_at: string;
  }>;
};

export type PlansResponse = {
  plans: Array<{
    plan: PlanCode;
    days: number;
    prices: Record<string, number>;
  }>;
};

type CacheEnvelope<T> = {
  updatedAt: number;
  value: T;
};

const LOCAL_API_FALLBACK = 'http://127.0.0.1:8000';
const REMOTE_API_FALLBACK = 'https://psychoware.website';
const RETRYABLE_STATUS_CODES = new Set([404, 405, 500, 502, 503, 504]);
const USER_STATUS_CACHE_PREFIX = 'api-cache:user:';
const PLANS_CACHE_KEY = 'api-cache:plans';
const DEFAULT_USER_STATUS_CACHE_AGE_MS = 60_000;
const DEFAULT_PLANS_CACHE_AGE_MS = 12 * 60 * 60 * 1000;
const runtimeCache = new Map<string, CacheEnvelope<unknown>>();

const API_BASE_CANDIDATES = (() => {
  const envBase = ((import.meta.env.VITE_API_BASE_URL as string | undefined) || '').trim().replace(/\/+$/, '');
  if (envBase) {
    return [envBase];
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return ['', LOCAL_API_FALLBACK];
    }

    const fallbackBase = ((import.meta.env.VITE_API_FALLBACK_URL as string | undefined) || REMOTE_API_FALLBACK)
      .trim()
      .replace(/\/+$/, '');
    return ['', fallbackBase];
  }

  return [REMOTE_API_FALLBACK];
})();

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readStorageCache<T>(key: string): CacheEnvelope<T> | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isObject(parsed)) {
      window.localStorage.removeItem(key);
      return null;
    }

    const updatedAt = parsed.updatedAt;
    if (typeof updatedAt !== 'number' || !Number.isFinite(updatedAt)) {
      window.localStorage.removeItem(key);
      return null;
    }

    return {
      updatedAt,
      value: parsed.value as T,
    };
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

function readCacheEntry<T>(key: string): CacheEnvelope<T> | null {
  const fromMemory = runtimeCache.get(key);
  if (fromMemory) {
    return fromMemory as CacheEnvelope<T>;
  }

  const fromStorage = readStorageCache<T>(key);
  if (fromStorage) {
    runtimeCache.set(key, fromStorage as CacheEnvelope<unknown>);
  }
  return fromStorage;
}

function writeCacheEntry<T>(key: string, value: T): void {
  const envelope: CacheEnvelope<T> = {
    updatedAt: Date.now(),
    value,
  };
  runtimeCache.set(key, envelope as CacheEnvelope<unknown>);

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(envelope));
  }
}

function isFresh(entry: CacheEnvelope<unknown>, maxAgeMs: number): boolean {
  return Date.now() - entry.updatedAt <= Math.max(0, maxAgeMs);
}

function userStatusCacheKey(tgChatId: number): string {
  return `${USER_STATUS_CACHE_PREFIX}${tgChatId}`;
}

function readCachedValue<T>(key: string, maxAgeMs: number): T | null {
  const entry = readCacheEntry<T>(key);
  if (!entry) {
    return null;
  }
  if (!isFresh(entry, maxAgeMs)) {
    return null;
  }
  return entry.value;
}

export function readCachedUserStatus(tgChatId: number, maxAgeMs = DEFAULT_USER_STATUS_CACHE_AGE_MS): UserStatus | null {
  return readCachedValue<UserStatus>(userStatusCacheKey(tgChatId), maxAgeMs);
}

export function readCachedPlans(maxAgeMs = DEFAULT_PLANS_CACHE_AGE_MS): PlansResponse | null {
  return readCachedValue<PlansResponse>(PLANS_CACHE_KEY, maxAgeMs);
}

export function invalidateUserStatusCache(tgChatId: number): void {
  const key = userStatusCacheKey(tgChatId);
  runtimeCache.delete(key);
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key);
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let lastError: unknown = null;

  for (let index = 0; index < API_BASE_CANDIDATES.length; index += 1) {
    const base = API_BASE_CANDIDATES[index] || '';
    const isLastCandidate = index === API_BASE_CANDIDATES.length - 1;
    const url = base ? `${base}${path}` : path;

    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers || {}),
        },
      });
      const contentType = (response.headers.get('Content-Type') || '').toLowerCase();
      const bodyText = await response.text();

      if (!response.ok) {
        const err: ApiError = new Error(
          bodyText ? `API request failed: ${response.status} ${bodyText}` : `API request failed: ${response.status}`,
        );
        err.status = response.status;

        if (!isLastCandidate && RETRYABLE_STATUS_CODES.has(response.status)) {
          lastError = err;
          continue;
        }

        throw err;
      }

      const trimmed = bodyText.trim();
      const likelyJson = contentType.includes('application/json') || trimmed.startsWith('{') || trimmed.startsWith('[');
      if (likelyJson) {
        try {
          return JSON.parse(bodyText) as T;
        } catch (parseError) {
          const err: ApiError = new Error(
            `Invalid JSON from API (${url}): ${(parseError as Error).message}. Raw: ${trimmed.slice(0, 160)}`,
          );
          lastError = err;
          if (!isLastCandidate) {
            continue;
          }
          throw err;
        }
      }

      const looksLikeHtml = trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || trimmed.startsWith('<');
      const err: ApiError = new Error(
        `API returned non-JSON response (${url})${looksLikeHtml ? ' [HTML detected]' : ''}: ${trimmed.slice(0, 160)}`,
      );
      lastError = err;
      if (!isLastCandidate) {
        continue;
      }
      throw err;
    } catch (error) {
      lastError = error;
      if (isLastCandidate) {
        throw error;
      }
    }
  }

  throw (lastError || new Error('API request failed'));
}

export async function registerUser(tgChatId: number, tgUsername: string | null): Promise<void> {
  await apiFetch('/api/register', {
    method: 'POST',
    body: JSON.stringify({
      tg_chat_id: tgChatId,
      tg_username: tgUsername,
    }),
  });
}

export async function getUserStatus(tgChatId: number): Promise<UserStatus> {
  const user = await apiFetch<UserStatus>(`/api/user/${tgChatId}`);
  writeCacheEntry(userStatusCacheKey(tgChatId), user);
  return user;
}

export async function ensureUserStatus(tgChatId: number, tgUsername: string | null): Promise<UserStatus> {
  try {
    return await getUserStatus(tgChatId);
  } catch (error) {
    const status = (error as ApiError).status;
    if (status !== 404) {
      throw error;
    }
  }

  await registerUser(tgChatId, tgUsername);
  return getUserStatus(tgChatId);
}

export async function getCachedUserStatus(
  tgChatId: number,
  tgUsername: string | null,
  options?: {
    maxAgeMs?: number;
    forceRefresh?: boolean;
    allowStaleOnError?: boolean;
  },
): Promise<UserStatus> {
  const maxAgeMs = options?.maxAgeMs ?? DEFAULT_USER_STATUS_CACHE_AGE_MS;
  const forceRefresh = options?.forceRefresh ?? false;
  const allowStaleOnError = options?.allowStaleOnError ?? true;
  const key = userStatusCacheKey(tgChatId);
  const cacheEntry = readCacheEntry<UserStatus>(key);

  if (!forceRefresh && cacheEntry && isFresh(cacheEntry, maxAgeMs)) {
    return cacheEntry.value;
  }

  try {
    const fresh = await ensureUserStatus(tgChatId, tgUsername);
    writeCacheEntry(key, fresh);
    return fresh;
  } catch (error) {
    if (allowStaleOnError && cacheEntry) {
      return cacheEntry.value;
    }
    throw error;
  }
}

export async function getPlans(): Promise<PlansResponse> {
  const plans = await apiFetch<PlansResponse>('/api/plans');
  writeCacheEntry(PLANS_CACHE_KEY, plans);
  return plans;
}

export async function getCachedPlans(options?: {
  maxAgeMs?: number;
  forceRefresh?: boolean;
  allowStaleOnError?: boolean;
}): Promise<PlansResponse> {
  const maxAgeMs = options?.maxAgeMs ?? DEFAULT_PLANS_CACHE_AGE_MS;
  const forceRefresh = options?.forceRefresh ?? false;
  const allowStaleOnError = options?.allowStaleOnError ?? true;
  const cacheEntry = readCacheEntry<PlansResponse>(PLANS_CACHE_KEY);

  if (!forceRefresh && cacheEntry && isFresh(cacheEntry, maxAgeMs)) {
    return cacheEntry.value;
  }

  try {
    const fresh = await getPlans();
    writeCacheEntry(PLANS_CACHE_KEY, fresh);
    return fresh;
  } catch (error) {
    if (allowStaleOnError && cacheEntry) {
      return cacheEntry.value;
    }
    throw error;
  }
}

export async function createPlategaPayment(params: {
  tg_chat_id: number;
  plan: PlanCode;
  devices: number;
  method: 'sbp' | 'card';
}): Promise<{ redirect?: string; redirectUrl?: string; paymentUrl?: string; url?: string; link?: string }> {
  return apiFetch<{ redirect?: string; redirectUrl?: string; paymentUrl?: string; url?: string; link?: string }>('/api/platega/create', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function createStarsInvoice(params: {
  tg_chat_id: number;
  plan: PlanCode;
  devices: number;
}): Promise<{ invoice_link: string; stars_amount: number; payment_id: string; price_rub: number }> {
  return apiFetch<{ invoice_link: string; stars_amount: number; payment_id: string; price_rub: number }>('/api/stars/create', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function createCryptoInvoice(params: {
  tg_chat_id: number;
  plan: PlanCode;
  devices: number;
}): Promise<{ invoice_id: number; pay_url: string; amount_usdt: number; price_rub: number }> {
  return apiFetch<{ invoice_id: number; pay_url: string; amount_usdt: number; price_rub: number }>('/api/crypto/create', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function checkCryptoInvoice(params: {
  invoice_id: number;
  tg_chat_id: number;
  plan: PlanCode;
  devices: number;
}): Promise<{ paid: boolean; status: string }> {
  return apiFetch<{ paid: boolean; status: string }>('/api/crypto/check', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function activateSubscription(params: {
  tg_chat_id: number;
  plan: PlanCode;
  max_devices: number;
  payment_id: string;
  payment_method: string;
}): Promise<{ success: boolean; expires_at: string }> {
  const result = await apiFetch<{ success: boolean; expires_at: string }>('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  invalidateUserStatusCache(params.tg_chat_id);
  return result;
}
