import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 200,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 100,
      maxVUs: 400,
    },
  },
};

export default function () {
  const randomNumber = Math.floor(Math.random() * (360000 - 300000 + 1)) + 300000;
  const res = http.get(`http://localhost:8080/reviews?product_id=${randomNumber}`);
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}


