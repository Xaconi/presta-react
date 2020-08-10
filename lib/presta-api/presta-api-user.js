// Presta-API
import { fetchAPI, postAPI, putAPI, prestaEvents } from './presta-api';
import { __PRESTA_CURRENCY__, __PRESTA_LANG__ } from './presta-api';

// Libs
import cookie from 'js-cookie';

// Local params
export let user;

function updateUserState(newUser) {
    user = newUser;
    prestaEvents.emit('updateUser', user);
    cookie.set("user", window.btoa(JSON.stringify(newUser)));
}

export async function initUser() {
    // We create the user with the Presta WS...
    const results = await postAPI('guests',
        `<?xml version="1.0" encoding="UTF-8"?>
        <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
            <guest></guest>
        </prestashop>`
    );

    // ...and we persist that cart on a state cookie
    updateUserState(results.guest);
}

export async function loadUser() {
    // We recover the cart from the state cookie
    user = JSON.parse(window.atob(cookie.get('user')));
    updateUserState(user);
}
