import axios from 'axios';
var base_URL = 'http://www.flash.flashentregas.com.br/index.php';
var Auth_User = 'admin';
var Auth_Pass = '1234';
const api = axios.create({
  baseURL: base_URL,
  Auth_User: Auth_User,
  Auth_Pass: Auth_Pass,
});

export default {
  api,
  baseURL: base_URL,
  Auth_User: Auth_User,
  Auth_Pass: Auth_Pass,
};