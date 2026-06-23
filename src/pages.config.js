/**
 * pages.config.js - Page routing configuration
 */
import Dashboard from './pages/Dashboard';
import GratitudeAffirmations from './pages/GratitudeAffirmations';
import History from './pages/History';
import HistoryDetail from './pages/HistoryDetail';
import Home from './pages/Home';
import Insights from './pages/Insights';
import Inventory from './pages/Inventory';
import Journaling from './pages/Journaling';
import Onboarding from './pages/Onboarding';
import Reading from './pages/Reading';
import ReviewInventory from './pages/ReviewInventory';
import Settings from './pages/Settings';
import SpotCheck from './pages/SpotCheck';
import Summary from './pages/Summary';
import TodayReadings from './pages/TodayReadings';
import Tools from './pages/Tools';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "GratitudeAffirmations": GratitudeAffirmations,
    "History": History,
    "HistoryDetail": HistoryDetail,
    "Home": Home,
    "Insights": Insights,
    "Inventory": Inventory,
    "Journaling": Journaling,
    "Onboarding": Onboarding,
    "Reading": Reading,
    "ReviewInventory": ReviewInventory,
    "Settings": Settings,
    "SpotCheck": SpotCheck,
    "Summary": Summary,
    "TodayReadings": TodayReadings,
    "Tools": Tools,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};