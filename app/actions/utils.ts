(BigInt as any).prototype.toJSON = function () {
  return this.toString();
};

export async function benchmark(fn: Promise<any>) {
  const start = performance.now();
  const response = await fn;

  const end = performance.now();
  const responseSize = JSON.stringify(response).length;

  return {
    ts: `${(end - start).toFixed(2)} ms`,
    response: JSON.stringify(response),
    size: `${(responseSize / 1024).toFixed(2)} KB`,
  };
}
