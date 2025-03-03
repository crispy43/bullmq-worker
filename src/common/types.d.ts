// * JSON 직렬화 타입 추론
export type ToJson<T> = T extends string | number | boolean | null
  ? T // 기본 타입은 그대로 반환
  : T extends undefined
  ? never // undefined는 반환하지 않음
  : T extends (...args: any[]) => any
  ? never // 함수는 반환하지 않음
  : T extends bigint
  ? string // bigint는 string으로
  : T extends symbol
  ? never // symbol은 반환하지 않음
  : T extends Promise<infer U>
  ? Promise<ToJson<U>> // Promise의 반환 타입에 ToJson 적용
  : T extends ArrayBuffer | ArrayBufferView
  ? never // ArrayBuffer와 TypedArray는 직렬화되지 않음
  : T extends Map<any, any>
  ? { [K in keyof T]: ToJson<T[K]> } // Map 처리
  : T extends Set<any>
  ? Array<ToJson<T extends Set<infer U> ? U : never>> // Set은 배열로 변환
  : T extends Date
  ? string // Date는 ISO 문자열로 변환
  : T extends Array<infer U>
  ? Array<ToJson<U>> // 배열은 재귀적으로 변환
  : { [K in keyof T]: ToJson<T[K]> };
