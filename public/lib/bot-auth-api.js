/**
 *
 * @author NDF, 23-Jul-2020.
 */

export class BotAuthApi {
  constructor () {
    this.handleLogoutButton();
  }

  async getUser () {
    let resp;
    try {
      resp = await window.fetch('/api/user/DUMMY');
      const USER = await resp.json();

      console.warn('User:', USER);

      return USER;
    } catch (err) {
      if (resp.status === 401) {
        console.error('Error getting user:', resp.statusText, resp);
      } else {
        console.error('Error getting user (2):', err, resp);
      }
    }

    return {};
  }

  // https://stackoverflow.com/questions/233507/how-to-log-out-user-from-web-site-using-basic-authentication
  // https://tuhrig.de/basic-auth-log-out-with-javascript/
  handleLogoutButton () {
    const $LOGOUT_BUTTON = document.querySelector('#logout-button');

    $LOGOUT_BUTTON.addEventListener('click', ev => {
      ev.preventDefault();

      console.warn('Logging out …');

      // 'http://log:out@localhost:3000/'

      window.fetch('/api/logout', { user: 'logout', password: '1234', headers: { Authorization: 'Basic xxx' } })
        .then(resp => console.warn('I think you were logged out!', resp))
        .catch(err => console.error('Error logging out?', err));
    });
  }
}
