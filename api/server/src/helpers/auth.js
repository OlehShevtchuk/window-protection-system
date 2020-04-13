
const isAuth = true;

export default function auth(request, response, next) {
  if(isAuth) {
      return next();
  }
  return response.status(401).json({ message: 'Not auth' });
}
