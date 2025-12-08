import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Summary from './pages/Summary';
import History from './pages/History';
import HistoryDetail from './pages/HistoryDetail';
import Settings from './pages/Settings';


export const PAGES = {
    "Onboarding": Onboarding,
    "Home": Home,
    "Inventory": Inventory,
    "Summary": Summary,
    "History": History,
    "HistoryDetail": HistoryDetail,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Onboarding",
    Pages: PAGES,
};