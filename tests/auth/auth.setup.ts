import { test as setup, expect } from '@playwright/test';
import { HomePage } from '../../pages/home-page/home-page';
import { GoogleAuthPage } from '../../pages/external/google-auth-page';
import { GOOGLE_AUTH_CREDENTIALS, SUPER_ADMIN_CREDENTIALS, USER_1_CREDENTIALS } from '../../constants/credentials';
import { SUPER_ADMIN_AUTH_STATE_FILE_PATH, USER_1_AUTH_STATE_FILE_PATH } from '../../constants/file-paths';

setup('authenticate as admin', async ({ page }) => {
    const homePage: HomePage = new HomePage(page)
    const googleAuthPage = new GoogleAuthPage(page)
    await homePage.navigate();

    // Applicable only for coder environment
    await googleAuthPage.loginToGoogle(GOOGLE_AUTH_CREDENTIALS.username, GOOGLE_AUTH_CREDENTIALS.password);
    await homePage.openLoginModal();
    await homePage.loginModal.login(SUPER_ADMIN_CREDENTIALS.username, SUPER_ADMIN_CREDENTIALS.password);
    await homePage.assertThat().userIsLoggedIn();

    await page.context().storageState({ path: SUPER_ADMIN_AUTH_STATE_FILE_PATH });
});

setup('authenticate as user_1', async ({ page }) => {
    const homePage: HomePage = new HomePage(page)
    const googleAuthPage = new GoogleAuthPage(page)
    await homePage.navigate();
    // Applicable only for coder environment
    await googleAuthPage.loginToGoogle(GOOGLE_AUTH_CREDENTIALS.username, GOOGLE_AUTH_CREDENTIALS.password);
    await homePage.openLoginModal();
    await homePage.loginModal.login(USER_1_CREDENTIALS.username, USER_1_CREDENTIALS.password);
    await homePage.assertThat().userIsLoggedIn();

    await page.context().storageState({ path: USER_1_AUTH_STATE_FILE_PATH });
});