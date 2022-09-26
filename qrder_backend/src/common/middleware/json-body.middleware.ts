import { json } from 'body-parser';

function jsonBodyMiddleware() {
  return json();
}

export default jsonBodyMiddleware;
