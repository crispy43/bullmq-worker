// * 환경변수 가져오기
export const env = (name: string, defaultValue?: string) => {
  const env = process.env[name];
  if (!env && !defaultValue) {
    throw new Error(`Please define the ${name} environment variable!`);
  }
  return env ? env : defaultValue;
};

export default function utils() {}
