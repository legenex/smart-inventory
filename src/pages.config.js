import History from './pages/History';
import HistoryDetail from './pages/HistoryDetail';
import Inventory from './pages/Inventory';
import Onboarding from './pages/Onboarding';
import ReviewInventory from './pages/ReviewInventory';
import Settings from './pages/Settings';
import Summary from './pages/Summary';
import Home from './pages/Home';
import __Layout from './Layout.jsx';


export const PAGES = {
    "History": History,
    "HistoryDetail": HistoryDetail,
    "Inventory": Inventory,
    "Onboarding": Onboarding,
    "ReviewInventory": ReviewInventory,
    "Settings": Settings,
    "Summary": Summary,
    "Home": Home,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};