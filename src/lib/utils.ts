// * ENV 가져오기
export const getEnv = (name: string, defaultValue?: string) => {
  const env = process.env[name];
  if (!env && !defaultValue) {
    throw new Error(`Please define the ${name} environment variable.`);
  }
  return env ? env : defaultValue;
};

// * Query string으로 변환
export const formatQueryString = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value !== 'undefined') searchParams.append(key, String(value));
  });
  return '?' + searchParams.toString();
};

// * JSON fetch
export const fetchJson = async <T = any>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    throw error;
  }
};
