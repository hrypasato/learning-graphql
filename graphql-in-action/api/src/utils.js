import crypto from 'crypto';

export const randomString = (bytesSize = 32) =>
  crypto.randomBytes(bytesSize).toString('hex');

export const numbersInRangeObject = (begin, end) => {
  let sum = 0;
  let count = 0;
  for(let i = begin; i <= end; i++){
    sum += i;
    count++;
  }

  let avg = sum / count;

  return { sum, count, avg}
}