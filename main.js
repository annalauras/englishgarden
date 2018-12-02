const getPath = () => window.location.pathname;
const getPage = () => window.location.pathname.split('/').pop();
const changePath = to => window.location.replace(to);

const initialDistanceFromTop = ele => $(ele)[0].getBoundingClientRect().top;
const currentDistanceFromTop = ele => $(ele).offset().top;

const screenSizeIsAtLeast = w =>
    window.matchMedia(`(min-width: ${w}px)`).matches;

const screenSizeIsUpTo = w =>
    window.matchMedia(`(max-width: ${w}px)`).matches;

const screenSizeIsBetween = (wmin, wmax) =>
    window.matchMedia(`(min-device-width: ${wmin}px) and (max-device-width: ${wmax}px)`).matches;

const InjectNavList = ({ injectInto, iconClass, navLinks, mobile = false }) => {
    const icon =
        `<i id='ico-btn-nav-toggle' class='${iconClass}'>menu</i>`;

    $(`
        ${mobile ? `${icon}` : ''}
        <div class='nav-bar ${mobile ? 'mobile' : ''}'></div>
    `).appendTo(injectInto);

    const nav = $('.nav-bar');

    navLinks.forEach(link =>
        $(`
            <div class='nav-bar-link'>
                <a href=${link.url}>${link.label}</a>
            </div>
        `).appendTo(nav)
    );

    if (mobile) {
        const btn = $('#ico-btn-nav-toggle');

        btn.click(e => {
            e.preventDefault();

            nav.toggleClass('open');

            if (nav.hasClass('open')) {
                btn.text('unfold_less');
            } else {
                btn.text('menu');
            }
        });
    }
};

const InjectSiteCredits = ({ element }) => {
    const year = new Date().getFullYear();

    $(`
        <div>&#169; ${year} The English Garden Daycare Nursery and Pre-school</div>
        <div id='name-tag'>Site by <a href='mailto:annasawangwan@gmail.com'>Anna Sawangwan</a></div>
    `).appendTo(element)
};

const Init = () => {
    const isIphoneSE = screenSizeIsUpTo(375);
    const isIphoneX = screenSizeIsUpTo(812);
    const isTabletSize = screenSizeIsBetween(375, 1024);
    const isLargerThanTablet = screenSizeIsAtLeast(1025);

    $("#scroll-top").click(e => {
        e.preventDefault();

        $('html, body').animate({
            scrollTop: 0
        }, 'slow');
    });

    $("#scroll-down").click(e => {
        e.preventDefault();

        $('html,body').animate({
            scrollTop: $("#about-col").offset().top
        }, 'slow');
    });

    document.addEventListener('scroll', e => {
        e.preventDefault();

        const topOfPage =
            currentDistanceFromTop('#scroll-top-container') - initialDistanceFromTop('#scroll-top-container') <= 0;

        if (!topOfPage) {
            $('#scroll-top').hasClass('hide') &&
                $('#scroll-top').removeClass('hide');
        } else if (!$('#scroll-top').hasClass('hide')) {
            $('#scroll-top').addClass('hide');
        }
    }, true);

    const localeEn = $('#ico-btn-en-toggle');
    const localeHu = $('#ico-btn-hu-toggle');

    localeEn.click(e => {
        e.preventDefault();

        const currentPath = getPath().split('/');
        const langIndex = currentPath.length - 2;

        currentPath[langIndex] = 'en';
        window.localStorage.setItem('locale', 'en');

        changePath(currentPath.join('/'));
    });

    localeHu.click(e => {
        e.preventDefault();

        const currentPath = getPath().split('/');
        const langIndex = currentPath.length - 2;

        currentPath[langIndex] = 'hu';
        window.localStorage.setItem('locale', 'hu');

        changePath(currentPath.join('/'));
    });

    let currentLocale = window.localStorage.getItem('locale');

    if (currentLocale === null) {
        window.localStorage.setItem('locale', 'en');
    }

    const actualPath = getPath().split('/');
    const langIndex = actualPath.length - 2;

    if (currentLocale !== actualPath[langIndex]) {
        actualPath[langIndex] = currentLocale;
        changePath(actualPath.join('/'));
    }

    currentLocale = window.localStorage.getItem('locale');

    if (currentLocale === 'en') {
        localeEn.addClass('selected');
        localeHu.removeClass('selected');
    } else if (currentLocale === 'hu') {
        localeHu.addClass('selected');
        localeEn.removeClass('selected');
    }

    const navIconClass =
        !isIphoneSE && isTabletSize ?
            'material-icons md-54' : 'material-icons md-36';

    const navLinks = [
        { url: 'index.html', label: currentLocale === 'en' ? 'Home' : 'Főoldal' },
        { url: 'photo-gallery.html', label: currentLocale === 'en' ? 'Photos' : 'Galéria' },
        { url: 'calendar.html', label: currentLocale === 'en' ? 'Calendar' : 'Naptár' },
        { url: 'parent-zone.html', label: currentLocale === 'en' ? 'Parents' : 'Parent Zone' },
        { url: 'minibus.html', label: currentLocale === 'en' ? 'Minibus' : 'Minibusz' },
    ];

    InjectNavList({
        injectInto: '#nav-menu',
        iconClass: navIconClass,
        navLinks: navLinks,
        mobile: !isLargerThanTablet 
    });

    InjectSiteCredits({
        element: '#site-credit'
    });

    $(window).resize(() => location.reload());
}

$(document).ready(Init);