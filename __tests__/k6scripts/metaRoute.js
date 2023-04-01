import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  const randomNumber = Math.floor(Math.random() * (360000 - 300000 + 1)) + 300000;
  const res = http.get(`http://localhost:8080/reviews/meta?product_id=${randomNumber}`);
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
