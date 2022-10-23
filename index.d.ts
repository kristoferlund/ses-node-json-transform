export interface TransformerMapOperateItem {
  run: string;
  on: string;
}

export interface TransformerMap {
  list?: string;
  item: any;
  remove?: string[];
  defaults?: any;
  operate: TransformerMapOperateItem[];
  each?: string;
}

export function transform(data: any, map: TransformerMap, context?: any): any;

export function transformAsync(
  data: any,
  map: TransformerMap,
  context?: any
): any;

export function DataTransform(
  data: any,
  map: TransformerMap
): {
  defaultOrNull: (key: string) => string | number | boolean | null;
  getValue: (obj: any, key: string, newKey?: string) => any;
  setValue: (
    obj: any,
    key: string,
    newValue?: string | number | boolean | null
  ) => void;
  getList: () => any;
  transform: (context: any) => any;
  transformAsync: (context: any) => Promise<any>;
  removeAll: (data: any) => any;
  remove: (item: any) => any;
  operate: (data: any, context: any) => string | number | boolean | null;
  each: (data: any, context: any) => any;
  iterator: (map: any, item: any) => any;
};
