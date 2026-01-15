import History from './pages/History';
import HistoryDetail from './pages/HistoryDetail';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Onboarding from './pages/Onboarding';
import ReviewInventory from './pages/ReviewInventory';
import Settings from './pages/Settings';
import Summary from './pages/Summary';
import __Layout from './Layout.jsx';


export const PAGES = {
    "History": History,
    "HistoryDetail": HistoryDetail,
    "Home": Home,
    "Inventory": Inventory,
    "Onboarding": Onboarding,
    "ReviewInventory": ReviewInventory,
    "Settings": Settings,
    "Summary": Summary,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};