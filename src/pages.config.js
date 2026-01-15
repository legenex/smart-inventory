import History from './pages/History';
import HistoryDetail from './pages/HistoryDetail';
import Inventory from './pages/Inventory';
import Onboarding from './pages/Onboarding';
import ReviewInventory from './pages/ReviewInventory';
import Settings from './pages/Settings';
import Summary from './pages/Summary';
import Dashboard from './pages/Dashboard';
import __Layout from './Layout.jsx';


export const PAGES = {
    "History": History,
    "HistoryDetail": HistoryDetail,
    "Inventory": Inventory,
    "Onboarding": Onboarding,
    "ReviewInventory": ReviewInventory,
    "Settings": Settings,
    "Summary": Summary,
    "Dashboard": Dashboard,
}

export const pagesConfig = {
    mainPage: "History",
    Pages: PAGES,
    Layout: __Layout,
};