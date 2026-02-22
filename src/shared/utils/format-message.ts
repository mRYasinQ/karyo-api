const formatMessage = (message: string, params: Record<string, string | number> = {}) => {
  return message.replace(/:(\w+)/g, (_: never, key: string) => (params[key] !== undefined ? String(params[key]) : `:${key}`));
};

export default formatMessage;
