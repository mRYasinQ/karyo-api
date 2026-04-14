import camelcaseKeys, { type ObjectLike } from 'camelcase-keys';

const toCamelCase = <T>(object: ObjectLike) => camelcaseKeys(object) as T;

export { toCamelCase };
