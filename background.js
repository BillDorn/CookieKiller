var timeoutId = 0;

function removeCookie(cookie) {
    let protocol = (cookie.secure) ? "https://" : "http://";
    let url = protocol + cookie.domain + cookie.path;
    return browser.cookies.remove({
        url: url,
        name: cookie.name,
        storeId: cookie.storeId,
        firstPartyDomain: cookie.firstPartyDomain
    });
}

function removeCookies(cookies) {
    return Promise.all(cookies.map(removeCookie));
}

function clearBadge() {
    browser.browserAction.setBadgeText({
        text: null
    });
}

function clearCookies(tab) {
    let baseDomain = getBaseDomain(new URL(tab.url).hostname);
    let cookiesResult = browser.cookies.getAll({
        domain: baseDomain,
        storeId: tab.cookieStoreId
    });
    cookiesResult.then((cookies) => {
       let removalResult = removeCookies(cookies);
       removalResult.then((res) => {
           let removed = res.filter(cookie => cookie !== null);
           let badgeColor, badgeText;
           if(removed.length == res.length) {
               badgeColor = "#32CD32";
               badgeText = removed.length.toString();
           } else {
               console.warn("Failed to remove %d cookies(not found).", res.length - removed.length);
               badgeColor = null;
               badgeText = "!";
           }
           clearTimeout(timeoutId);
           timeoutId = setTimeout(clearBadge, 1000);
           browser.browserAction.setBadgeBackgroundColor({
               color: badgeColor
           });
           browser.browserAction.setBadgeText({
               text: badgeText
           });
       });
    });
}
browser.browserAction.onClicked.addListener(clearCookies);