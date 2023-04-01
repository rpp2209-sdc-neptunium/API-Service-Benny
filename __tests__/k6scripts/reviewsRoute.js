import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  const randomNumber = Math.floor(Math.random() * (360000 - 300000 + 1)) + 300000;
  const randomNumber2 = Math.floor(Math.random() * (3));
  const sort = {0: 'helpful', 1: 'relevant', 2: 'newest'};
  const res = http.get(`http://localhost:8080/reviews?product_id=${randomNumber}&sort=${sort[randomNumber2]}`);
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}


