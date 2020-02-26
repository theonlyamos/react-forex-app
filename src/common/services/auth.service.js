import axios from 'axios';

/**
 * @class AuthService
 * @static
 * @hideconstructor
 */
class AuthService {
  /**
   * @static
   * @description Gets access token from the localStorage
   * @return {string}
   */
  static get accessToken() {
    return localStorage.getItem('accessToken');
  }

  /**
   * @static
   * @description Sets access token at the localStorage
   * @param {string} token
   * @return {void}
   */
  static set accessToken(accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }

  /**
   * @static
   * @return {boolean}
   */
  static get isAuth() {
    return Boolean(this.accessToken);
  }

  static async login(email, password) {
    return await axios.post('/api/auth/login', { email, password });
  }

  static async register(data = {}) {
    return await axios.post('/api/auth/register', data);
  }

  /**
   * @static
   * @description Clear all token of the localStorage.
   * @returns {void}
   */
  static logout() {
    localStorage.removeItem('accessToken');
    this.removeAdminAccess()
  }

  /**
   * @static
   * @description Save admin token then admin can return to admin account
   * @returns {void}
   */
  static set adminToken(accessToken){
    localStorage.setItem('adminToken', accessToken);
  }

  /**
   * @static
   * @description Get Admin token
   * @returns {void}
   */
  static get adminToken(){
    const token = localStorage.getItem('adminToken');
    if(token){
      return token;
    }
    return '';
  }

  /**
   * @static
   * @description Clear admin token of the localStorage.
   * @returns {void}
   */
  static removeAdminAccess(){
    localStorage.removeItem('adminToken');
  }
}

export default AuthService;
