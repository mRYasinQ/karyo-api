import camelcaseKeys, { type ObjectLike } from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

const toCamelCase = <T>(object: ObjectLike) => camelcaseKeys(object) as T;

const toSnakeCase = <T>(object: ObjectLike) => snakecaseKeys(object) as T;

export { toCamelCase, toSnakeCase };
