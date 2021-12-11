// layouts
import layout1 from './layouts/layout1/layout1';
import layout2 from './layouts/layout2/layout2';
import layout3 from './layouts/layout3/layout3';
import layout4 from './layouts/layout4/layout4';

// components
import Home from './components/home/home';
import ExploreAll from './components/explore/explore-all';
import LiveAuctions from './components/auctions/live-auctions-list';
import ItemDetails from './components/item-detail/item-detail';
import Activity from './components/activity/activity';
import Blog from './components/blog/blog';
import BlogSingle from './components/blog-single/blog-single';
import HelpCenter from './components/help-center/help-center';
import Authors from './components/authors-list/authors-list';
import Author from './components/author/author';
import Profile from './components/profile/profile';
import CreateNFT from './components/create-nft/create-nft';
import MyCollections from './components/collections/my-collections';
import CreateCollection from './components/create-collection/create-collection';
import CollectionDetails from './components/collections/collection-details';
import Wallet from './components/wallet/wallet';
import Signup from './components/signup/signup';
import Contact from './components/contact/contact';
import SellNFT from './components/nfts/sell-nft';
import NotFound from './components/not-found/not-found';
import HowItWorks from './components/how-it-works/how-it-works';
import PrivacyTerms from './components/privacy-&-terms/privacy-&-terms';
import History from './components/history/index';

// routes
const routes = [
    { path: '/', access: true, exact: true, title: 'Home', layout: layout2, component: Home },
    { path: '/history', access: true, exact: true, title: 'History', layout: layout2, component: History },
    { path: '/explore-all', access: true, exact: true, title: 'Explore', layout: layout2, component: ExploreAll },
    { path: '/auctions', access: true, exact: true, title: 'Live Auctions', layout: layout2, component: LiveAuctions },
    { path: '/item-details', access: true, exact: true, title: 'Item Details', layout: layout2, component: ItemDetails },
    { path: '/sell-item/:itemId?', access: true, exact: true, title: 'Sell Item', layout: layout2, component: SellNFT },
    { path: '/activity', access: true, exact: true, title: 'Activity', layout: layout2, component: Activity },
    { path: '/blog', access: true, exact: true, title: 'Blog', layout: layout1, component: Blog },
    { path: '/blog-single', access: true, exact: true, title: 'Blog Single', layout: layout1, component: BlogSingle },
    { path: '/help-center', access: true, exact: true, title: 'Help Center', layout: layout1, component: HelpCenter },
    { path: '/authors', access: true, exact: true, title: 'Authors', layout: layout2, component: Authors },
    { path: '/author/:authorId?', access: true, exact: true, title: 'Author Profile', layout: layout1, component: Author },
    { path: '/profile', access: true, exact: true, title: 'Profile', layout: layout1, component: Profile },
    { path: '/create', access: true, exact: true, title: 'Create', layout: layout2, component: CreateNFT },
    { path: '/collections', access: true, exact: true, title: 'Collections', layout: layout2, component: MyCollections },
    { path: '/collection/create', access: true, exact: true, title: 'Create Collection', layout: layout2, component: CreateCollection },
    { path: '/collection-details/:collectionId?', access: true, exact: true, title: 'Collection Details', layout: layout1, component: CollectionDetails },
    { path: '/login', access: true, exact: true, title: 'login', layout: layout4, component: Wallet },
    { path: '/signup', access: true, exact: true, title: 'Signup', layout: layout4, component: Signup },
    { path: '/contact', access: true, exact: true, title: 'Contact', layout: layout1, component: Contact },
    { path: '/history', access: true, exact: true, title: 'History', layout: layout2, component: History },
    { path: '/how-it-works', access: true, exact: true, title: 'How It Works', layout: layout1, component: HowItWorks },
    { path: '/privacy-and-terms', access: true, exact: true, title: 'Privacy & Terms', layout: layout1, component: PrivacyTerms },
    { path: '/*', access: true, exact: true, name: 'Not Found', layout: layout3, component: NotFound }
];

export default routes;
