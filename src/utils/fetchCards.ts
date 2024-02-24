export interface FetchResult<T> {
  data: T[] | null;
  isLoading: boolean;
  error: string | null;
}

const fetchData = async<T>(baseUrl: string, params?: Record<string, any>): Promise<FetchResult<T>> => {
  let result: FetchResult<T> = { data: null, isLoading: true, error: null };

  try {
    const url = new URL(baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value.toString()));
    }
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    result = { data: data, isLoading: false, error: null };
  } catch (error) {
    const err = error as Error;
    result = { data: null, isLoading: false, error: `Error fetching data: ${err.message}` };
  }

  return result;
};

export const fetchAllCards = async (
  page: number = 1,
  pageSize: number = 5,
  cardName?: string | undefined,
  color?: string[] | undefined,
  type?: string[] | undefined,
  subtype?: string[] | undefined,
  text?: string | undefined
) => {
  const params: Record<string, string> = {
    page: page.toString(),
    pageSize: pageSize.toString(),
    name: cardName || "",
    text: text || "",
  };

  if (color && color.length > 0) {
    params.colors = color.join('|');
  }

  console.log("color: ", params.color);

  if (type && type.length > 0) {
    params.types = type.join('|');
  }

  if (subtype && subtype.length > 0) {
    params.subtypes = subtype.join('|');
  }

  return fetchData('https://api.magicthegathering.io/v1/cards', params);
};

export const fetchAllTypes = async () => {
  const result = await fetchData<string[]>('https://api.magicthegathering.io/v1/types');
  return result;
};

export const fetchAllSubtypes = async () => {
  const result = await fetchData<string[]>('https://api.magicthegathering.io/v1/subtypes');
  return result;
};
