// * 아이템 리스트 데이터 타입
export interface ItemsData<T = any> {
  total?: number;
  cursor?: string | null;
  items: T[];
}
